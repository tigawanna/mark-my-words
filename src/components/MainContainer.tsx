import { PublicationTargetFormContainer } from "./form/PublicationTargetFormContainer";
import { PublishDetailsForm } from "./form/PublishDetailsForm";

interface MainContainerProps {

}

export function MainContainer({}:MainContainerProps){
return (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <h1 className="text-3xl ">mark my words</h1>
    <PublishDetailsForm />
    <PublicationTargetFormContainer/>
  </div>
);
}
