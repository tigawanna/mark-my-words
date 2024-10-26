import { usePublishFormsStore } from "../../store/publish-form-store";
import { usePublishTargetsStore } from "../../store/targets-store";
import { PublishTargetEndpoint } from "./publish-target/PublishTargetEndpoint";
import { PublishTargetFormTabs } from "./publish-target/PublishTargetTabs";

interface PublicationTargetFormContainerProps {

}

export function PublicationTargetFormContainer({}:PublicationTargetFormContainerProps){
 const { oneTarget,setOneTarget } = usePublishTargetsStore();
return (
 <div className='w-full h-full flex flex-col items-center justify-center'>
    <PublishTargetEndpoint endpoint={{
      name: oneTarget.name,
      endpoint: oneTarget.endpoint,
      method: oneTarget.method,
      body: oneTarget.body,
      headers: oneTarget.headers
    }} 
    setEndpoint={(value) => setOneTarget(value)}/>
    <PublishTargetFormTabs/>
 </div>
);
}
