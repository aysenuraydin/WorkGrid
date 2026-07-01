using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.Domain.Enums
{
    public enum RelationType
    {
        OneToOne = 0,
        OneToMany = 1,
        ManyToMany = 2,
        ManyToOne = 3
    }
}