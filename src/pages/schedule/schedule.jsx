import React, { useEffect, useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { IconEye } from '@tabler/icons-react'
// import placeApi from '../../api/placeApi'
import scheduleApi from '../../api/scheduleApi'
import destinationsApi from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [scheduleData, setScheduleData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    image: [],
    destination_id: null
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  useEffect(() => {
    fetchSchedule()
    fetchDestinations()
  }, [])

  useEffect(() => {}, [scheduleData])

  const fetchSchedule = async () => {
    try {
      const data = await scheduleApi.getAll()
      setSchedules(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error)
    }
  }

  const fetchDestinations = async () => {
    try {
      const data = await destinationsApi.getAllDestinations()
      setDestinations(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách điểm đến:', error)
    }
  }

  const handleOpen = (schedule = null) => {
    if (schedule) {
      setScheduleData({ ...schedule, destination_id: schedule.destination_id || null })
      setPreviewImages(schedule.image ? schedule.image.map((img) => img.url) : [])
      setEditId(schedule._id)
    } else {
      setScheduleData({ name: '', description: '', image: [], destination_id: null })
      setPreviewImages([])
      setEditId(null)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setPreviewImages([])
    setEditId(null)
  }

  const handleChange = (e) => {
    setScheduleData({ ...scheduleData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(imageURLs)
    setScheduleData({ ...scheduleData, image: files })
  }

  const handleSubmit = async () => {
    try {
      setCheck(true)
      const formData = new FormData()

      const jsonData = {
        name: scheduleData.name,
        description: scheduleData.description,
        destination_id: scheduleData.destination_id ? scheduleData.destination_id._id : null
      }

      formData.append('data', JSON.stringify(jsonData))

      if (scheduleData.image.length > 0) {
        scheduleData.image.forEach((file, index) => {
          formData.append('image', file)
        })
      }

      if (editId) {
        await scheduleApi.update(editId, jsonData)
        toast.success('Chỉnh sửa thông tin thành công!')
      } else {
        await scheduleApi.create(formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Tạo địa điểm thành công!')
      }

      setCheck(false)

      setScheduleData({ name: '', address: '', start_date: '', nd_date: '', image: [], destination_id: null })

      await fetchSchedule()
      handleClose()
    } catch (error) {
      setCheck(false)
      toast.error('Có lỗi xảy ra!')
      console.error('Lỗi khi gửi dữ liệu địa điểm:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await scheduleApi.deleteSchedule(id)
        fetchSchedule()
      } catch (error) {
        console.error('Lỗi khi xóa khách sạn:', error)
      }
    }
  }

  const handleOpenImageDialog = (images) => {
    setSelectedImages(images)
    setImageDialogOpen(true)
  }

  return (
    <div>
      <h2>Danh Sách Lịch trình </h2>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm lịch trình
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Miêu tả</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Khách hàng</TableCell>
              {/* <TableCell>Hình ảnh</TableCell> */}
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule._id}>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{schedule.description}</TableCell>
                <TableCell>{schedule.start_date}</TableCell>
                <TableCell>{schedule.end_date}</TableCell>
                <TableCell>{schedule.name}</TableCell>
                {/* <TableCell>
                  {schedule.image && schedule.image.length > 0 && (
                    <IconButton onClick={() => handleOpenImageDialog(schedule.image.map((img) => img.url))}>
                      <IconEye />
                    </IconButton>
                  )}
                </TableCell> */}
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(schedule)}>
                    Sửa
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(schedule._id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <div>
          <Backdrop sx={(theme) => ({ color: '#199c51', zIndex: 999999 })} open={check}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
        <DialogTitle>{editId ? 'Chỉnh sửa khách sạn' : 'Thêm khách sạn'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            name="name"
            value={scheduleData.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Miêu tả"
            name="description"
            value={scheduleData.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          {!editId && (
            <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ marginTop: '10px' }} />
          )}
          <Autocomplete
            options={destinations}
            getOptionLabel={(option) => option?.name}
            defaultValue={scheduleData?.destination_id?._id || null}
            value={scheduleData?.destination_id || null}
            onChange={(event, newValue) => setScheduleData({ ...scheduleData, destination_id: newValue })}
            renderInput={(params, index) => (
              <TextField key={index} {...params} label="Chọn địa điểm" margin="dense" fullWidth />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Hình ảnh địa điểm</DialogTitle>
        <DialogContent>
          {selectedImages.map((img, index) => (
            <img key={index} src={img} alt="schedule" style={{ width: '100%', marginBottom: 10, borderRadius: 5 }} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer></ToastContainer>
    </div>
  )
}
export default ScheduleManagement
