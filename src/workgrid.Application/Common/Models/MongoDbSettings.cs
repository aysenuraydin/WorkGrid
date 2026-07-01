using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.Application.Common.Models;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string CellsCollection { get; set; } = null!;
}