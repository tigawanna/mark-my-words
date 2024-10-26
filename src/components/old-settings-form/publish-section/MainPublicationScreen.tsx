import { PublishSelectionForm } from "../../form/PublishDetailsForm";

interface MainPublicationScreenProps {

}

export function MainPublicationScreen({}:MainPublicationScreenProps){
return (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <h1 className="text-3xl ">mark my words</h1>
    <PublishSelectionForm />
  </div>
);
}


