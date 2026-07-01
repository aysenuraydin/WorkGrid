using FluentScheduler;
using workgrid.Application.Common.Interfaces;

namespace workgrid.WebApi.Jobs;

public class PurgeDeletedDataJob : IJob
{
    private readonly IServiceProvider _serviceProvider;

    public PurgeDeletedDataJob(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void Execute()
    {
        // 🔒 Hidden. Akış: scope aç → eşik tarihi hesapla →
        //   eşikten eski soft-delete kayıtları (kolon/satır/tablo) parametreli
        //   sorgularla kalıcı sil → sonucu raporla.
        throw new NotImplementedException("Source available on request.");
    }
}