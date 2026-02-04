import WorkflowCanvas from "@/component/workflow/WorkflowCanvas";
import { CenterColumn } from "@/styles/base/BaseComponents";
import { ReactFlowProvider } from "@xyflow/react";

export default function WorkflowPage() {
  return (
    <CenterColumn width="100%" height="100%">
      <ReactFlowProvider>
        <WorkflowCanvas />
      </ReactFlowProvider>
    </CenterColumn>
  );
}
