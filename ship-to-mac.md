## That :ship: life

Shipping to mac is easy. Here's the deal:

Application installation, and automatic updates are driven by [Squirrel](https://github.com/Squirrel) and [Squirrel for Mac ](https://github.com/Squirrel/Squirrel.Mac/)

#### Package

To create a [Mac installer](https://github.com/Squirrel/Squirrel.Mac/) run:

```
  script\package-mac
```

This command should be run on a Mac machine.

### Release

To release the Squirrel installer:

```
  script\release-mac
```

This uploads an installer to S3.

You can provide access keys by adding a ``s3.key`` file to the root in the following format
```
AWSAccessKeyId=MYACCESSKEY
AWSSecretKey=SECRETKEY
```
``s3.key`` is ignored in the ``.gitignore`` file. Please do not check in sensitive information such as s3 keys.
