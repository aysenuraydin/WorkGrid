using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Domain.Common;

namespace workgrid.Application.Common.Behaviors;

public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public TransactionBehavior(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (request is not IRequest<TResponse>) return await next();
        if (!typeof(TRequest).Name.EndsWith("Command")) return await next();

        using var transaction = await _unitOfWork.BeginTransactionAsync();

        try
        {
            var response = await next();

            if (response is IResult { Succeeded: false })
            {
                await transaction.RollbackAsync();
                return response;
            }


            await _unitOfWork.CommitAsync(cancellationToken);

            await transaction.CommitAsync();

            return response;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();

            var detailedError = ex.InnerException?.InnerException?.Message
                                ?? ex.InnerException?.Message
                                ?? ex.Message;

            if (typeof(TResponse).IsGenericType && typeof(TResponse).GetGenericTypeDefinition() == typeof(Result<>))
            {
                var failureMethod = typeof(TResponse).GetMethod("Failure", new[] { typeof(string) });
                if (failureMethod != null)
                {
                    return (TResponse)failureMethod.Invoke(null, new object[] { $"Transaction failed: {detailedError}" });
                }
            }

            throw;
        }
    }
}