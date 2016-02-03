# electron-accelerator

electron-accelerator is a cross platform application, built on [Electron](https://github.com/atom/electron)



### Bootstrap

To get up and running

```
  script/bootstrap
```

### Build

Builds can be generated easily via
```
  script/build
```
Builds are generated using the  [electron-packager](https://github.com/maxogden/electron-packager) combined with
configuration from the ``config.json`` file. See the [Configuration documentation](config.md) for more details.

### Development & Debugging

To run up the application

```
  script/server
```

To debug, there are two options

- Debugging render processes with the [chrome dev tools](http://electron.atom.io/docs/v0.31.0/tutorial/devtools-extension/)
- Attach a ``node-inspector`` remote debugger. To [debug the main process](http://electron.atom.io/docs/v0.31.0/tutorial/using-native-node-modules/) via the following helper scripts:
```
  script/server-debug
```
Node inspector can be quite slow to load. If you are looking to step through code at the beginning of the applications life cycle, it can  be helpful to add a blocking wait on application start up.

Note: currently this is only supported in [Electron v 0.27.1](https://github.com/atom/electron/releases?after=v0.27.1)
