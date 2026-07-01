using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.Domain.Enums;

public enum AttributeEnum
{
    options = 0,
    multiple = 1,
    rows = 2,
    cols = 3,
    step = 4,
    accept = 5,
    maxSizeMB = 6,
    format = 7,
    rangeLimit = 8,

    required = 9,
    autoFocus = 10,
    label = 11,
};