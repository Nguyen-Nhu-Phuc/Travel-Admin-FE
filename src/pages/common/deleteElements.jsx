import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export const DeleteElements = ({ checkElement, id, open, data, handleClose = () => { }, onDelete = () => { } }) => {

    const [check, setCheck] = useState(false)

    const handleDelete = async () => {
        setCheck(true)
        try {
            await onDelete(id);
            handleClose()
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa!')
        } finally {
            setCheck(false)
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <>
                    <div>
                        <Backdrop
                            sx={(theme) => ({ color: '#199c51', zIndex: theme.zIndex.drawer + 1 })}
                            open={check}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    </div>
                </>
                <DialogTitle id='alert-dialog-title'>
                    <Typography component={'div'} variant='h5'>Thông báo</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {checkElement == 'place' && <Typography component={'span'}  >
                            Bạn chắc chắn muốn xóa địa điểm {data?.name}?
                        </Typography>}
                        {checkElement == 'hotel' && <Typography component={'span'}  >
                            Bạn chắc chắn muốn xóa khách sạn {data?.name}?
                        </Typography>}
                        {checkElement == 'restaurant' && <Typography component={'span'}  >
                            Bạn chắc chắn muốn xóa nhà hàng {data?.name}?
                        </Typography>}
                        {checkElement == 'destination' && <Typography component={'span'}  >
                            Bạn chắc chắn muốn xóa địa điểm {data?.name}?
                        </Typography>}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='secondary' variant='contained' onClick={handleClose}>Bỏ qua</Button>
                    <Button variant='contained' color='error' onClick={handleDelete}>Xóa</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

