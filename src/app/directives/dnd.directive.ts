import {Directive, HostBinding, HostListener } from "@angular/core";
import {FileService} from "../services/file.service";
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
        let path = "";
        if (this.homeComponent.currentFolder === "" && this.homeComponent.currentPath === "") {
            path = "";
        } else if (this.homeComponent.currentPath === "") {
                path = this.homeComponent.currentFolder;
        } else {
            path = (this.homeComponent.currentPath + "/" + this.homeComponent.currentFolder);
        }
        this.fileService.uploadFiles(evt.dataTransfer.files, path, this.homeComponent.userData._id)
            .catch(error => {
                this.homeComponent.error = JSON.parse(error._body).error;
            });
        this.homeComponent.displayFolderContents(this.homeComponent.currentFolder, this.homeComponent.currentPath);
    }
}
