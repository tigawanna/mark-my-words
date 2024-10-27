
import { usePublishTargetsStore } from "../../store/targets-store";
import { PublishTargetEndpoint } from "./publish-target/PublishTargetEndpoint";
import { PublishTargetFormTabs } from "./publish-target/PublishTargetTabs";

interface PublicationTargetFormContainerProps {

}

export function PublicationTargetFormContainer({}:PublicationTargetFormContainerProps){
 const { oneTarget,setOneTarget } = usePublishTargetsStore();
return (
 <div className='w-full h-full flex p-5 m-5 border-t flex-col items-center justify-center'>
  <h1 className="text-xl ">Publish Target {oneTarget.name}</h1>
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
