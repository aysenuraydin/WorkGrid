using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.DTO.DTOs;

public record SendChannelMessageRequest(
    string? MessageText = null,
    string? AttachmentUrl = null,
    string? AttachmentType = null,
    string? AttachmentName = null
);
