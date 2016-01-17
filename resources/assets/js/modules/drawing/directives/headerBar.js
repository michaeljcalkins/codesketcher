module.exports = function HeaderBarDirective() {
    return {
        scope: {
            drawingStorage: '='
        },
        template: `
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li>
                            <a href="#">New</a>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Open <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Rectangle</a></li>
                                <li><a href="#">Oval</a></li>
                                <li><a href="#">Text</a></li>
                                <li><a href="#">Image</a></li>
                                <li><a href="#">Show Layout</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Styled Text</a></li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Insert <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Rectangle</a></li>
                                <li><a href="#">Oval</a></li>
                                <li><a href="#">Text</a></li>
                                <li><a href="#">Image</a></li>
                                <li><a href="#">Show Layout</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Styled Text</a></li>
                            </ul>
                        </li>
                        <li>
                            <a href="#">Group</a>
                        </li>
                        <li>
                            <a href="#">Ungroup</a>
                        </li>
                        <li>
                            <a href="#">Zoom In</a>
                        </li>
                        <li>
                            <a href="#">Zoom Out</a>
                        </li>
                        <li>
                            <a href="#">Rotate</a>
                        </li>
                        <li>
                            <a href="#">Scale</a>
                        </li>
                        <li>
                            <a href="#">Forward</a>
                        </li>
                        <li>
                            <a href="#">Backward</a>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">View <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Show Pixels</a></li>
                                <li><a href="#">Show Rulers</a></li>
                                <li><a href="#">Show Grid</a></li>
                                <li><a href="#">Show Layout</a></li>
                                <li class="divider"></li>
                                <li><a href="#">Grid Settings</a></li>
                                <li><a href="#">Layout Settings</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Export <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Single Preview File (HTML)</a></li>
                                <li><a href="#">Image (.png)</a></li>
                                <li><a href="#">HTML Files</a></li>
                                <li><a href="#">AngularJS (v1) Directive</a></li>
                                <li><a href="#">AngularJS (v1) Component</a></li>
                                <li><a href="#">ReactJS Dumb Component</a></li>
                                <li><a href="#">ReactJS Component</a></li>
                                <li><a href="#">VueJS Component</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `
    }
}
