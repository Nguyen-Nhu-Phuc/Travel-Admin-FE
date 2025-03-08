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
import scheduleApi from '../../api/scheduleApi'
import destinationsApi from '../../api/destinationApi'
import Backdrop from '@mui/material/Backdrop'

import { toast, ToastContainer } from 'react-toastify'

import CircularProgress from '@mui/material/CircularProgress'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Rating from '@mui/material/Rating'
import Chip from '@mui/material/Chip'
import { styled, useTheme } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import LinearProgress from '@mui/material/LinearProgress'
import useMediaQuery from '@mui/material/useMediaQuery'
import { data } from 'react-router'

// Styled Timeline component
const Timeline = styled(MuiTimeline)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root:nth-of-type(even) .MuiTimelineContent-root': {
    textAlign: 'left'
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiTimelineItem-root': {
      width: '100%',
      '&:before': {
        display: 'none'
      }
    }
  }
}))

const ImageList = [
  '/images/misc/plant-1.png',
  '/images/misc/plant-2.png',
  '/images/misc/plant-3.png',
  '/images/misc/plant-4.png'
]

const Data = [
  {
    image: '/images/misc/zipcar.png',
    title: 'Zipcar',
    subtitle: 'Vuejs, React & HTML',
    progress: 24895.65,
    progressColor: 'primary'
  },
  {
    image: '/images/misc/bitbank.png',
    title: 'Bitbank',
    subtitle: 'Sketch, Figma & XD',
    progress: 86500.2,
    progressColor: 'info'
  },
  {
    image: '/images/misc/aviato.png',
    title: 'Aviato',
    subtitle: 'HTML & Anguler',
    progress: 12450.8,
    progressColor: 'secondary'
  }
]

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([])
  const [destinations, setDestinations] = useState([])
  const [open, setOpen] = useState(false)
  const [scheduleData, setScheduleData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  })
  const [editId, setEditId] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [check, setCheck] = useState(false)

  const theme = useTheme()
  const isBelowMdScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  const [scheduleOne, setScheduleOne] = useState(null)

  useEffect(() => {
    fetchSchedule()
    fetchDestinations()
  }, [])

  useEffect(() => {}, [scheduleData])

  const fetchSchedule = async () => {
    try {
      const data = await scheduleApi.getAll()
      setSchedules(data)
      console.log(data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa điểm:', error)
    }
  }

  const fetchOneSchedule = async (id) => {
    try {
      const data = await scheduleApi.getById(id)
      setScheduleOne(data)
    } catch (error) {
      console.error('Lỗi:', error)
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

      setScheduleData({ name: '', address: '', start_date: '', end_date: '', image: [], destination_id: null })

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

  // ==================

  const handleOpenDetailDialog = (schedule, id) => {
    setSelectedSchedule(schedule)
    setDetailDialogOpen(true)
    fetchOneSchedule(id)
  }

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false)
    setSelectedSchedule(null)
  }
  // ==================

  // Hàm chuyển đổi time từ định dạng AM/PM sang số (giờ phút)
  const convertTo24Hour = (time) => {
    const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1)
    let hours = parseInt(hour, 10)
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
    return hours * 60 + parseInt(minute, 10) // Tổng số phút trong ngày
  }

  // Gom tất cả các đối tượng có `time`
  let events = []
  // const [envent, setEvent] = useState([])

  scheduleOne?.schedule?.forEach((day) => {
    if (day.hotel) {
      events.push({ ...day.hotel, type: 'hotel' })
    }
    if (day.place) {
      events.push(...day.place.map((p) => ({ ...p, type: 'place' })))
    }
    if (day.restaurant) {
      events.push(...day.restaurant.map((r) => ({ ...r, type: 'restaurant' })))
    }
  })

  // Sắp xếp theo thời gian tăng dần
  events.sort((a, b) => convertTo24Hour(a.time) - convertTo24Hour(b.time))

  console.log(events)

  return (
    <div>
      <h2>Danh Sách Lịch trình </h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Miêu tả</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule._id}>
                <TableCell>{schedule.name}</TableCell>
                <TableCell>{schedule.description}</TableCell>
                <TableCell>{new Date(schedule.start_date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(schedule.end_date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDetailDialog(schedule, schedule._id)}>
                    <IconEye />
                  </IconButton>
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
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)}>
        <DialogTitle>Chi tiết lịch trình</DialogTitle>
        <DialogContent>
          <Timeline>
            {events
              ?.filter(
                (schedule) => schedule.type === 'restaurant' || schedule.type === 'hotel' || schedule.type === 'place'
              )
              .map((schedule, index) => {
                const position = isBelowMdScreen ? 'right' : index % 2 === 0 ? 'left' : 'right'

                return (
                  <TimelineItem key={index} position={position}>
                    {!isBelowMdScreen && (
                      <TimelineOppositeContent>
                        <Typography variant="caption" component="div" className="mbs-5">
                          {schedule.time}
                        </Typography>
                      </TimelineOppositeContent>
                    )}

                    <TimelineSeparator>
                      <TimelineDot color={schedule.type === 'restaurant' ? 'error' : 'primary'} variant="tonal">
                        <i className="tabler-file text-xl" />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>

                    <TimelineContent>
                      {/* Nếu màn hình nhỏ, hiển thị thời gian phía trên nội dung */}
                      {isBelowMdScreen && (
                        <Typography variant="caption" component="div" className="mbs-5">
                          2 months ago
                        </Typography>
                      )}

                      <Card>
                        <CardContent>
                          <Typography variant="h5" className="mbe-4">
                            {schedule.name}
                          </Typography>
                          <Typography className="mbe-3">
                            The process of recording the key project details and producing the documents that are
                            required to implement it successfully. Simply put, it's an umbrella term which includes all
                            the documents created over the course of the project.
                          </Typography>
                          <div className="flex items-center gap-2.5 is-fit rounded bg-actionHover plb-[5px] pli-2.5">
                            <img height={20} alt="documentation.pdf" src="/images/icons/pdf-document.png" />
                            <Typography className="font-medium">documentation.pdf</Typography>
                          </div>
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
          </Timeline>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer></ToastContainer>
    </div>
  )
}
export default ScheduleManagement
