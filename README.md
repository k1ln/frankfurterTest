# frankfurterTest

run:
```
node index.js
```

/auth -> POST body {"key":"1234567890"}
  
/latest -> GET -> HEADER Authorization : Result from /auth
  
## Testing
Please add the token from auth path to latest Authorization Header, when testing.

## Insomnia
insomnia files are added in the insomnia folder.
Please see as well attached screenshots if you cannot import into insomnia.
![alt text](https://github.com/k1ln/frankfurterTest/blob/main/insomnia/Auth.png?raw=true)
![alt text](https://github.com/k1ln/frankfurterTest/blob/main/insomnia/Latest.png?raw=true)





