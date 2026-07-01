using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.Domain.Enums;

public enum PropertyEnum
{
    placeholder = 0,
    defaultValue = 1,
    helpText = 2,
    prefix = 3,
    suffix = 4,
    size = 5,
    readOnly = 6,
    disabled = 7,
    hidden = 8,

    min = 9,
    max = 10,
    minLength = 11,
    maxLength = 12,
    pattern = 13,
};
