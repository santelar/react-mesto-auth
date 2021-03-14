import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeletePopup({ isOpen, onClose, onDeleteCard, onClickOverlay}) {
  
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    setIsLoading(true);
    onDeleteCard();
  }
  return(
    <PopupWithForm
      title="Вы уверены?"
      name="deleteImage"
      button={isLoading ? "Удаление..." : "Да"}
      isOpen={isOpen}
      onClose={onClose}
      isValid={true}
      onSubmit={handleSubmit}
      onClickOverlay={onClickOverlay}
    />
  )
}

export default DeletePopup;