using Stripe;
using Stripe.Checkout;

namespace Aero_comidas.Services;

/// <summary>
/// Serviço para integração com Stripe para processamento de pagamentos
/// </summary>
public class StripePaymentService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<StripePaymentService> _logger;

    public StripePaymentService(IConfiguration configuration, ILogger<StripePaymentService> logger)
    {
        _configuration = configuration;
        _logger = logger;

        // Configura a chave secreta do Stripe
        var stripeSecretKey = _configuration["Stripe:SecretKey"];
        if (!string.IsNullOrEmpty(stripeSecretKey))
        {
            StripeConfiguration.ApiKey = stripeSecretKey;
        }
        else
        {
            _logger.LogWarning("Chave secreta do Stripe não configurada. Configure em appsettings.json");
        }
    }

    /// <summary>
    /// Cria uma sessão de pagamento no Stripe Checkout
    /// </summary>
    public async Task<Session> CreateCheckoutSessionAsync(
        decimal amount,
        string currency,
        string successUrl,
        string cancelUrl,
        Dictionary<string, string>? metadata = null)
    {
        try
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>
                {
                    "card"
                },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = currency.ToLower(),
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Pedido - Aero Comidas",
                                Description = "Pagamento do pedido"
                            },
                            UnitAmount = (long)(amount * 100), // Stripe usa centavos
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl,
            };

            if (metadata != null && metadata.Any())
            {
                options.Metadata = metadata;
            }

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            _logger.LogInformation("Sessão de pagamento criada: {SessionId} para valor {Amount:C}",
                session.Id, amount);

            return session;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar sessão de pagamento no Stripe");
            throw;
        }
    }

    /// <summary>
    /// Obtém informações de uma sessão de pagamento
    /// </summary>
    public async Task<Session> GetSessionAsync(string sessionId)
    {
        try
        {
            var service = new SessionService();
            return await service.GetAsync(sessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar sessão {SessionId} no Stripe", sessionId);
            throw;
        }
    }

    /// <summary>
    /// Verifica se o pagamento foi concluído com sucesso
    /// </summary>
    public async Task<bool> IsPaymentSuccessfulAsync(string sessionId)
    {
        try
        {
            var session = await GetSessionAsync(sessionId);
            return session.PaymentStatus == "paid";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar status de pagamento da sessão {SessionId}", sessionId);
            throw;
        }
    }

    /// <summary>
    /// Cria um reembolso para um pagamento
    /// </summary>
    public async Task<Refund> CreateRefundAsync(string paymentIntentId, long? amount = null)
    {
        try
        {
            var options = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId,
            };

            if (amount.HasValue)
            {
                options.Amount = amount.Value;
            }

            var service = new RefundService();
            var refund = await service.CreateAsync(options);

            _logger.LogInformation("Reembolso criado: {RefundId} para PaymentIntent {PaymentIntentId}",
                refund.Id, paymentIntentId);

            return refund;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar reembolso para PaymentIntent {PaymentIntentId}", paymentIntentId);
            throw;
        }
    }

    /// <summary>
    /// Processa webhook do Stripe
    /// </summary>
    public Event ConstructWebhookEvent(string json, string signature)
    {
        try
        {
            var webhookSecret = _configuration["Stripe:WebhookSecret"];
            if (string.IsNullOrEmpty(webhookSecret))
            {
                throw new InvalidOperationException("Stripe webhook secret não configurado");
            }

            return EventUtility.ConstructEvent(json, signature, webhookSecret);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar webhook do Stripe");
            throw;
        }
    }
}
