import {createElement} from './src/Component';

import Carousel from "./src/Carousel";

let imgList = [
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600365121087&di=d312360385d1faa889dcddb5cfc51f90&imgtype=0&src=http%3A%2F%2Fimages.xuejuzi.cn%2F1707%2F1_170706094327_1.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600365121087&di=3e531d76ed774540977cf108e4acc762&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fphotoblog%2F7%2F2%2F5%2F4%2F7254647%2F20088%2F16%2F1218844847035_mthumb.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600365121085&di=fe57d0abba6709c45348c4ee767d1363&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F-vo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Fd6ca7bcb0a46f21f0bb3e175f3246b600c33ae15.jpg'
]

let a = <Carousel imgList={imgList} autoPlay={false} drag={true}/>
a.mountTo(document.body);