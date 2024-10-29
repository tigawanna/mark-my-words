
import { usePublishTargetsStore } from "../../store/targets-store";
import { PublishTargetEndpoint } from "./publish-target/PublishTargetEndpoint";
import { PublishTargetFormTabs } from "./publish-target/PublishTargetTabs";

interface PublicationTargetFormContainerProps {

}

export function PublicationTargetFormContainer({}:PublicationTargetFormContainerProps){
 const { oneTarget,setOneTarget } = usePublishTargetsStore();
return (
 <div className='w-full h-full flex border-t pt-5 mt-5 flex-col items-center justify-center'>
  <h1 className="text-xl ">Publish Target {oneTarget.name}</h1>
    <PublishTargetEndpoint endpoint={{
      baseUrl: oneTarget.baseUrl,
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
