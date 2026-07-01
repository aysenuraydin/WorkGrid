using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.DTO.DTOs;

public record ChannelDto(
    Guid Id,
    string Name,
    string CreatedById,
    DateTime CreatedAt
);