module.exports = function headerBar() {
    return {
        scope: {
            drawingStorage: '='
        },
        template: `
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Export <span class="caret"></span></a>
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
