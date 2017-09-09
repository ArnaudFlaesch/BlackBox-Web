import {Directive, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";
import {FileService} from "../service/file.service";

@Directive({
  selector: "[appHome]"
})
export class DndDirective {
    @HostBinding("style.background") private background = "#eee";

    constructor(private fileService: FileService) { }

    @HostListener("dragover", ["$event"]) public onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = "#999";
    }

    @HostListener("dragleave", ["$event"]) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = "#eee";
    }

    @HostListener("drop", ["$event"]) public onDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.background = "#eee";
        this.fileService.uploadFiles(evt.dataTransfer.files);
    }
}
