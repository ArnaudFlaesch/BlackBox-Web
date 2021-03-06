// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/dist/long-stack-trace-zone";
import "zone.js/dist/proxy.js";
import "zone.js/dist/sync-test";
import "zone.js/dist/jasmine-patch";
import "zone.js/dist/async-test";
import "zone.js/dist/fake-async-test";
import {async, getTestBed, TestBed} from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BlackBoxComponent} from "./app/app.component";
import {RouterTestingModule} from "@angular/router/testing";
import {HomeComponent} from "./app/components/home/home.component";
import {RegisterComponent} from "./app/components/register/register.component";
import {UserService} from "./app/services/user.service";
import {FileService} from "./app/services/file.service";
import {MdDialogModule} from "@angular/material";
import {OrderModule} from "ngx-order-pipe";
import {ContextMenuModule} from "ngx-contextmenu";

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare const __karma__: any;
declare const require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
            BlackBoxComponent,
            HomeComponent,
            RegisterComponent
        ],
        providers: [
            UserService, FileService
        ],
        imports: [
            ContextMenuModule,
            FormsModule,
            HttpModule,
            MdDialogModule,
            OrderModule,
            RouterTestingModule
        ]
    }).compileComponents();
}));

// Then we find all the tests.
const context = require.context("./", true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
// Finally, start Karma to run the tests.
__karma__.start();
