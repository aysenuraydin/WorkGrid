namespace workgrid.Domain.Enums;

public enum ValidationRuleEnum
{
    required = 0,
    email = 1,
    url = 2,
    min = 3,
    max = 4,
    minLength = 5,
    maxLength = 6,
    matches = 7,
    allowedValues = 8,
    unique = 9,
    integer = 10,
    positive = 11,
    negative = 12,
    length = 13,
    pattern = 14,
    trim = 15,
}
