import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ShowMoreButton } from '@/components/catalog/ShowMoreButton/ShowMoreButton'

describe('ShowMoreButton', () => {
  beforeEach(() => vi.clearAllMocks())

  const onBtnClick = vi.fn()

  it('calls callback on click', async () => {
    const user = userEvent.setup()
    render(<ShowMoreButton onBtnClick={onBtnClick} disabled={false} />)
    await user.click(screen.getByRole('button', { name: 'Show more' }))
    expect(onBtnClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled is true', () => {
    render(<ShowMoreButton onBtnClick={onBtnClick} disabled />)
    expect(screen.getByRole('button', { name: 'Show more' })).toBeDisabled()
  })

  it('does not call callback when button disabled', async () => {
    const user = userEvent.setup()
    render(<ShowMoreButton onBtnClick={onBtnClick} disabled />)
    await user.click(screen.getByRole('button', { name: 'Show more' }))
    expect(onBtnClick).not.toHaveBeenCalled()
  })
})
