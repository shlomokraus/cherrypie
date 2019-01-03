import { Container } from "inversify";
import { GitService } from "../service/Git";
import { MessagesService } from "../service/Messages";
import { FilesystemService } from "../service/Filesystem";
import React, { useState } from "react";
import { Setup } from "../components/Setup";
import { RouterProvider } from "../context/Router";
import { MemoryRouter } from "react-router";
import { Route, Switch } from "react-router-dom";
import { GlobalStateProvider } from "../context/GlobalState";

export function PopupRoot() {
	return (
		<div>PopUp</div>
	);
}
