import { bind } from "astal";
import { App, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import BarButton from "../BarButton";
import { range } from "../../../lib/utils";
import BarItem from "../BarItem";

export default (prop: { gdkmonitor: Gdk.Monitor }) => {
	const hypr = Hyprland.get_default();
	const ws: number = 10;

	const focusWorkspace = (workspaceId: number) =>
		hypr.dispatch("workspace", workspaceId.toString());

  const workspaceIndicatorClass = (workspaceId: number, focusedWorkspaceId: number) => {
    if (workspaceId === focusedWorkspaceId)
      return "bar__workspaces-indicator active";
    else if ((hypr.get_workspace(workspaceId)?.get_clients().length) > 0)
      return "bar__workspaces-indicator occupied";
    else
      return "bar__workspaces-indicator"
  }

  const workspaceOnCurrentMonitor = (workspaceId: number) =>
    hypr.get_workspace(workspaceId)?.get_monitor().get_model() === prop.gdkmonitor.get_model()

	return (
		<BarItem>
			<box spacing={8}>
				{
          range(ws)
            .filter(i => workspaceOnCurrentMonitor(i))
            .map((i) => {
					return (
						<button
							valign={Gtk.Align.CENTER}
							className={bind(hypr, "focusedWorkspace").as(
								(fw) => workspaceIndicatorClass(i, fw.id),
							)}
							onClicked={() => focusWorkspace(i)}
						/>
					);
				})}
			</box>
		</BarItem>
	);
};
