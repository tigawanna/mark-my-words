import { usePublishTargetsStore } from "../../store/targets-store";
import { PublishTargetEndpoint } from "./publish-target/PublishTargetEndpoint";
import { PublishTargetFormTabs } from "./publish-target/PublishTargetTabs";

interface PublicationTargetFormContainerProps {

}

export function PublicationTargetFormContainer({}:PublicationTargetFormContainerProps){
 
return (
 <div className='w-full h-full flex flex-col items-center justify-center'>
    <PublishTargetEndpoint/>
    <PublishTargetFormTabs/>
 </div>
);
}
