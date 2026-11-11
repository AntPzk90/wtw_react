type ShowMoreBtnProps = {
  onBtnClick: () => void
  disabled: boolean
}
export const ShowMoreButton = ({ onBtnClick, disabled }: ShowMoreBtnProps) => {
  return (
    <div className="catalog__more">
      <button disabled={disabled} className="catalog__button" type="button" onClick={onBtnClick}>
        Show more
      </button>
    </div>
  )
}
