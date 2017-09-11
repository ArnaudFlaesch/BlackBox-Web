import {Directive, HostBinding, HostListener } from "@angular/core";
import {FileService} from "../service/file.service";
import {HomeComponent} from "../components/home/home.component";

@Directive({
  selector: "[appHome]"
})
export class DndDirective {
    @HostBinding("style.background") private background = "#eee";

    constructor(private homeComponent: HomeComponent, private fileService: FileService) { }

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
        this.fileService.uploadFiles(evt.dataTransfer.files, this.homeComponent.currentFolder, this.homeComponent.userData._id);
        this.homeComponent.displayFolderContents(this.homeComponent.currentFolder);
    }
}
