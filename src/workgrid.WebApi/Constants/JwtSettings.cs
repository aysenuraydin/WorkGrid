using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace workgrid.WebApi.Constants
{
    public class JwtSettings
    {
        public const string ISSUER = "Authentication:Jwt:Issuer";
        public const string AUDIENCE = "Authentication:Jwt:Audience";
        public const string SIGNIN_KEY = "Authentication:Jwt:SigningKey";
    }
}