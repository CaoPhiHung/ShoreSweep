﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoreSweep.Api.Framework
{
    public class AuthenticateAttribute: Attribute
    {
        public Role Role { get; set; }
    }
}
