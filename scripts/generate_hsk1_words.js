// Generate a beginner-friendly Chinese vocabulary JSON (~600+ entries)
// Fields: level_id, hanzi, pinyin, meaning_en, meaning_vi, example_hanzi
// Note: HSK1 officially has ~150 words; this script expands with common
// kid-friendly vocabulary (numbers, colors, animals, family, school, food, etc.)
// to approach a large starter set. We can iterate to reach ~1000.

const fs = require('fs');
const path = require('path');

const LEVEL_ID = 'HSK1';

function item(hanzi, pinyin, en, vi, example) {
  return {
    level_id: LEVEL_ID,
    hanzi,
    pinyin,
    meaning_en: en,
    meaning_vi: vi,
    example_hanzi: example,
  };
}

// Base words across beginner-friendly categories
const baseWords = [
  // Pronouns & people
  ['我', 'wǒ', 'I; me', 'tôi', '我是学生'],
  ['你', 'nǐ', 'you', 'bạn', '你是我的朋友'],
  ['他', 'tā', 'he; him', 'anh ấy', '他是老师'],
  ['她', 'tā', 'she; her', 'cô ấy', '她是医生'],
  ['我们', 'wǒmen', 'we; us', 'chúng tôi', '我们一起学习'],
  ['你们', 'nǐmen', 'you (plural)', 'các bạn', '你们在教室里'],
  ['他们', 'tāmen', 'they; them', 'họ', '他们喜欢运动'],
  // Common verbs
  ['是', 'shì', 'to be', 'là', '他是学生'],
  ['有', 'yǒu', 'to have', 'có', '我有一本书'],
  ['去', 'qù', 'to go', 'đi', '我们去学校'],
  ['来', 'lái', 'to come', 'đến', '朋友来了'],
  ['看', 'kàn', 'to look; watch', 'xem; nhìn', '我看电影'],
  ['听', 'tīng', 'to listen', 'nghe', '她听音乐'],
  ['说', 'shuō', 'to speak; say', 'nói', '他说中文'],
  ['读', 'dú', 'to read', 'đọc', '我读书'],
  ['写', 'xiě', 'to write', 'viết', '他写作业'],
  ['学', 'xué', 'to study; learn', 'học', '我们学汉语'],
  ['学习', 'xuéxí', 'to study; learn', 'học', '我在学习汉语'],
  ['喜欢', 'xǐhuān', 'to like', 'thích', '我喜欢苹果'],
  ['爱', 'ài', 'to love', 'yêu', '他们爱家人'],
  ['想', 'xiǎng', 'to want; think', 'muốn; nghĩ', '我想喝水'],
  ['做', 'zuò', 'to do; make', 'làm', '他做饭'],
  ['玩', 'wán', 'to play', 'chơi', '孩子们玩游戏'],
  ['跑', 'pǎo', 'to run', 'chạy', '我们在操场跑'],
  ['走', 'zǒu', 'to walk', 'đi bộ', '他们走路回家'],
  ['跳', 'tiào', 'to jump', 'nhảy', '孩子跳得很高'],
  ['吃', 'chī', 'to eat', 'ăn', '我吃米饭'],
  ['喝', 'hē', 'to drink', 'uống', '他喝牛奶'],
  ['睡觉', 'shuìjiào', 'to sleep', 'ngủ', '宝宝睡觉了'],
  ['起床', 'qǐchuáng', 'to get up', 'dậy', '我六点起床'],
  ['上学', 'shàngxué', 'to go to school', 'đi học', '孩子们上学了'],
  ['回家', 'huíjiā', 'to go home', 'về nhà', '我们五点回家'],
  ['打电话', 'dǎ diànhuà', 'to make a call', 'gọi điện', '妈妈打电话'],
  // Basic adjectives
  ['好', 'hǎo', 'good', 'tốt', '今天天气很好'],
  ['坏', 'huài', 'bad', 'xấu', '这个习惯不好'],
  ['大', 'dà', 'big', 'to', '这只狗很大'],
  ['小', 'xiǎo', 'small', 'nhỏ', '小猫很可爱'],
  ['多', 'duō', 'many; much', 'nhiều', '这里人很多'],
  ['少', 'shǎo', 'few; little', 'ít', '水不太少'],
  ['高', 'gāo', 'tall; high', 'cao', '他个子很高'],
  ['低', 'dī', 'low', 'thấp', '声音有点低'],
  ['热', 'rè', 'hot', 'nóng', '今天很热'],
  ['冷', 'lěng', 'cold', 'lạnh', '水很冷'],
  ['新', 'xīn', 'new', 'mới', '我买了新书'],
  ['旧', 'jiù', 'old (not new)', 'cũ', '这张桌子很旧'],
  ['快', 'kuài', 'fast', 'nhanh', '跑得很快'],
  ['慢', 'màn', 'slow', 'chậm', '走得很慢'],
  // Question words
  ['什么', 'shénme', 'what', 'cái gì', '这是什么'],
  ['哪', 'nǎ', 'which; where', 'nào; ở đâu', '你去哪'],
  ['谁', 'shéi', 'who', 'ai', '他是谁'],
  ['多少', 'duōshao', 'how many; how much', 'bao nhiêu', '这个多少钱'],
  ['怎么', 'zěnme', 'how', 'như thế nào', '怎么做这个'],
  ['为什么', 'wèishénme', 'why', 'tại sao', '你为什么学中文'],
  // Measure words
  ['个', 'gè', 'general measure word', 'cái (lượng từ)', '一个苹果'],
  ['本', 'běn', 'measure word for books', 'quyển (lượng từ)', '三本书'],
  ['只', 'zhī', 'measure word for animals', 'con (lượng từ)', '两只猫'],
  ['张', 'zhāng', 'measure word for flat objects', 'tấm (lượng từ)', '一张纸'],
  // Time words
  ['今天', 'jīntiān', 'today', 'hôm nay', '今天我们上学'],
  ['明天', 'míngtiān', 'tomorrow', 'ngày mai', '明天去公园'],
  ['昨天', 'zuótiān', 'yesterday', 'hôm qua', '昨天看电影'],
  ['现在', 'xiànzài', 'now', 'bây giờ', '现在开始上课'],
  ['早上', 'zǎoshang', 'morning', 'buổi sáng', '早上起床'],
  ['下午', 'xiàwǔ', 'afternoon', 'buổi chiều', '下午写作业'],
  ['晚上', 'wǎnshang', 'evening; night', 'buổi tối', '晚上看电视'],
  ['点', 'diǎn', "o'clock; point", 'giờ; điểm', '三点上课'],
  // Colors
  ['红', 'hóng', 'red', 'đỏ', '红苹果'],
  ['蓝', 'lán', 'blue', 'xanh dương', '蓝天空'],
  ['黄', 'huáng', 'yellow', 'vàng', '黄色的花'],
  ['绿', 'lǜ', 'green', 'xanh lá', '绿色的草'],
  ['黑', 'hēi', 'black', 'đen', '黑猫'],
  ['白', 'bái', 'white', 'trắng', '白云'],
  ['粉红', 'fěnhóng', 'pink', 'hồng', '粉红的裙子'],
  ['橙色', 'chéngsè', 'orange (color)', 'cam', '橙色的球'],
  ['紫色', 'zǐsè', 'purple', 'tím', '紫色的花'],
  ['灰色', 'huīsè', 'gray', 'xám', '灰色的帽子'],
  // Animals
  ['猫', 'māo', 'cat', 'con mèo', '这是一只猫'],
  ['狗', 'gǒu', 'dog', 'con chó', '那是一只狗'],
  ['鸟', 'niǎo', 'bird', 'con chim', '树上有鸟'],
  ['鱼', 'yú', 'fish', 'con cá', '池里有鱼'],
  ['马', 'mǎ', 'horse', 'con ngựa', '马跑得快'],
  ['牛', 'niú', 'cow; ox', 'con bò', '牛在吃草'],
  ['羊', 'yáng', 'sheep', 'con cừu', '羊很可爱'],
  ['兔子', 'tùzi', 'rabbit', 'con thỏ', '兔子跳来跳去'],
  ['熊', 'xióng', 'bear', 'con gấu', '熊很大'],
  ['老虎', 'lǎohǔ', 'tiger', 'con hổ', '老虎很强'],
  ['狮子', 'shīzi', 'lion', 'sư tử', '狮子在动物园'],
  ['猴子', 'hóuzi', 'monkey', 'con khỉ', '猴子会爬树'],
  ['鸭子', 'yāzi', 'duck', 'con vịt', '鸭子在水里'],
  ['鹅', 'é', 'goose', 'ngỗng', '鹅在湖边'],
  ['猪', 'zhū', 'pig', 'con lợn', '猪在吃饭'],
  // Family
  ['爸爸', 'bàba', 'dad', 'bố', '我的爸爸'],
  ['妈妈', 'māma', 'mom', 'mẹ', '她是我的妈妈'],
  ['哥哥', 'gēge', 'older brother', 'anh trai', '我有一个哥哥'],
  ['姐姐', 'jiějie', 'older sister', 'chị gái', '她是我的姐姐'],
  ['弟弟', 'dìdi', 'younger brother', 'em trai', '弟弟很聪明'],
  ['妹妹', 'mèimei', 'younger sister', 'em gái', '妹妹很漂亮'],
  ['爷爷', 'yéye', 'grandfather (paternal)', 'ông nội', '爷爷讲故事'],
  ['奶奶', 'nǎinai', 'grandmother (paternal)', 'bà nội', '奶奶做饭'],
  ['外公', 'wàigōng', 'grandfather (maternal)', 'ông ngoại', '外公很亲切'],
  ['外婆', 'wàipó', 'grandmother (maternal)', 'bà ngoại', '外婆很温柔'],
  ['孩子', 'háizi', 'child', 'trẻ em', '孩子们在玩'],
  ['朋友', 'péngyou', 'friend', 'bạn bè', '我们是朋友'],
  // School & study
  ['学校', 'xuéxiào', 'school', 'trường học', '我在学校'],
  ['老师', 'lǎoshī', 'teacher', 'giáo viên', '老师教我们'],
  ['学生', 'xuésheng', 'student', 'học sinh', '学生认真听课'],
  ['课', 'kè', 'lesson; class', 'bài học; lớp học', '我们上课'],
  ['作业', 'zuòyè', 'homework', 'bài tập', '我做作业'],
  ['考试', 'kǎoshì', 'exam; test', 'kỳ thi', '我们明天考试'],
  ['书', 'shū', 'book', 'sách', '我读书'],
  ['笔', 'bǐ', 'pen', 'bút', '用笔写字'],
  ['铅笔', 'qiānbǐ', 'pencil', 'bút chì', '我用铅笔'],
  ['本子', 'běnzi', 'notebook', 'vở', '写在本子上'],
  ['书包', 'shūbāo', 'schoolbag', 'cặp sách', '书包很新'],
  ['教室', 'jiàoshì', 'classroom', 'phòng học', '我们在教室'],
  ['图书馆', 'túshūguǎn', 'library', 'thư viện', '去图书馆读书'],
  // Daily objects & home
  ['桌子', 'zhuōzi', 'table', 'bàn', '桌子很干净'],
  ['椅子', 'yǐzi', 'chair', 'ghế', '椅子很舒服'],
  ['床', 'chuáng', 'bed', 'giường', '床很软'],
  ['门', 'mén', 'door', 'cửa', '关门'],
  ['窗户', 'chuānghu', 'window', 'cửa sổ', '打开窗户'],
  ['房间', 'fángjiān', 'room', 'phòng', '房间很亮'],
  ['厨房', 'chúfáng', 'kitchen', 'nhà bếp', '厨房很干净'],
  ['客厅', 'kètīng', 'living room', 'phòng khách', '客厅很大'],
  ['厕所', 'cèsuǒ', 'toilet', 'nhà vệ sinh', '厕所很干净'],
  ['浴室', 'yùshì', 'bathroom', 'phòng tắm', '浴室有热水'],
  // Food & drinks
  ['米饭', 'mǐfàn', 'rice (cooked)', 'cơm', '我吃米饭'],
  ['面条', 'miàntiáo', 'noodles', 'mì', '他喜欢吃面条'],
  ['面包', 'miànbāo', 'bread', 'bánh mì', '买面包'],
  ['汤', 'tāng', 'soup', 'canh', '喝汤'],
  ['菜', 'cài', 'dish; vegetable', 'món ăn; rau', '做菜'],
  ['肉', 'ròu', 'meat', 'thịt', '吃肉'],
  ['鸡肉', 'jīròu', 'chicken', 'thịt gà', '鸡肉很香'],
  ['牛肉', 'niúròu', 'beef', 'thịt bò', '牛肉很好吃'],
  ['猪肉', 'zhūròu', 'pork', 'thịt lợn', '猪肉很新鲜'],
  ['鱼肉', 'yúròu', 'fish meat', 'thịt cá', '鱼肉很鲜'],
  ['水果', 'shuǐguǒ', 'fruit', 'trái cây', '我爱吃水果'],
  ['苹果', 'píngguǒ', 'apple', 'táo', '苹果很甜'],
  ['香蕉', 'xiāngjiāo', 'banana', 'chuối', '香蕉很好吃'],
  ['梨', 'lí', 'pear', 'lê', '梨很香'],
  ['橙子', 'chéngzi', 'orange', 'cam', '橙子很甜'],
  ['西瓜', 'xīguā', 'watermelon', 'dưa hấu', '西瓜很大'],
  ['葡萄', 'pútao', 'grapes', 'nho', '葡萄很甜'],
  ['草莓', 'cǎoméi', 'strawberry', 'dâu tây', '草莓很红'],
  ['桃子', 'táozi', 'peach', 'đào', '桃子很香'],
  ['牛奶', 'niúnǎi', 'milk', 'sữa', '喝牛奶'],
  ['水', 'shuǐ', 'water', 'nước', '喝水'],
  ['茶', 'chá', 'tea', 'trà', '喝茶'],
  ['咖啡', 'kāfēi', 'coffee', 'cà phê', '喝咖啡'],
  ['糖', 'táng', 'sugar; candy', 'đường; kẹo', '吃糖'],
  // Places
  ['家', 'jiā', 'home; family', 'nhà; gia đình', '回家'],
  ['医院', 'yīyuàn', 'hospital', 'bệnh viện', '去医院'],
  ['商店', 'shāngdiàn', 'shop; store', 'cửa hàng', '去商店买东西'],
  ['超市', 'chāoshì', 'supermarket', 'siêu thị', '在超市买水果'],
  ['公园', 'gōngyuán', 'park', 'công viên', '去公园玩'],
  ['银行', 'yínháng', 'bank', 'ngân hàng', '去银行'],
  ['邮局', 'yóujú', 'post office', 'bưu điện', '去邮局寄信'],
  ['餐厅', 'cāntīng', 'restaurant', 'nhà hàng', '在餐厅吃饭'],
  ['学校门', 'xuéxiàomén', 'school gate', 'cổng trường', '我们在学校门见面'],
  // Transportation
  ['车', 'chē', 'vehicle; car', 'xe; ô tô', '坐车去学校'],
  ['自行车', 'zìxíngchē', 'bicycle', 'xe đạp', '骑自行车'],
  ['摩托车', 'mótuōchē', 'motorcycle', 'xe máy', '骑摩托车'],
  ['公交车', 'gōngjiāochē', 'bus', 'xe buýt', '坐公交车'],
  ['出租车', 'chūzūchē', 'taxi', 'xe taxi', '打出租车'],
  ['地铁', 'dìtiě', 'subway', 'tàu điện ngầm', '坐地铁'],
  ['火车', 'huǒchē', 'train', 'tàu hỏa', '坐火车'],
  ['飞机', 'fēijī', 'airplane', 'máy bay', '坐飞机'],
  ['船', 'chuán', 'boat', 'thuyền', '坐船'],
  // Tech & appliances
  ['电脑', 'diànnǎo', 'computer', 'máy tính', '用电脑学习'],
  ['手机', 'shǒujī', 'mobile phone', 'điện thoại', '看手机'],
  ['电视', 'diànshì', 'television', 'tivi', '看电视'],
  ['电话', 'diànhuà', 'telephone', 'điện thoại', '打电话'],
  ['灯', 'dēng', 'lamp; light', 'đèn', '开灯'],
  ['空调', 'kōngtiáo', 'air conditioner', 'máy lạnh', '开空调'],
  ['冰箱', 'bīngxiāng', 'fridge', 'tủ lạnh', '冰箱里有水果'],
  // Body parts
  ['头', 'tóu', 'head', 'đầu', '头很疼'],
  ['脸', 'liǎn', 'face', 'mặt', '洗脸'],
  ['眼睛', 'yǎnjing', 'eyes', 'mắt', '眼睛看书'],
  ['耳朵', 'ěrduo', 'ears', 'tai', '耳朵听音乐'],
  ['鼻子', 'bízi', 'nose', 'mũi', '鼻子闻花香'],
  ['嘴', 'zuǐ', 'mouth', 'miệng', '嘴在说话'],
  ['牙齿', 'yáchǐ', 'teeth', 'răng', '刷牙齿'],
  ['手', 'shǒu', 'hand', 'tay', '用手写字'],
  ['手指', 'shǒuzhǐ', 'finger', 'ngón tay', '手指很灵活'],
  ['脚', 'jiǎo', 'foot', 'chân', '用脚踢球'],
  ['背', 'bèi', 'back', 'lưng', '背很酸'],
  ['肚子', 'dùzi', 'belly', 'bụng', '肚子饿了'],
  // Weather & nature
  ['天气', 'tiānqì', 'weather', 'thời tiết', '今天天气很好'],
  ['太阳', 'tàiyáng', 'sun', 'mặt trời', '太阳很亮'],
  ['月亮', 'yuèliàng', 'moon', 'mặt trăng', '月亮很圆'],
  ['星星', 'xīngxing', 'stars', 'ngôi sao', '晚上有很多星星'],
  ['雨', 'yǔ', 'rain', 'mưa', '下雨了'],
  ['雪', 'xuě', 'snow', 'tuyết', '下雪了'],
  ['风', 'fēng', 'wind', 'gió', '风很大'],
  ['云', 'yún', 'cloud', 'mây', '白云在天上'],
  ['山', 'shān', 'mountain', 'núi', '山很高'],
  ['河', 'hé', 'river', 'sông', '河水很清'],
  ['海', 'hǎi', 'sea', 'biển', '海很蓝'],
  // Clothing
  ['衣服', 'yīfu', 'clothes', 'quần áo', '买衣服'],
  ['裤子', 'kùzi', 'pants', 'quần', '穿裤子'],
  ['鞋子', 'xiézi', 'shoes', 'giày', '穿鞋子'],
  ['帽子', 'màozi', 'hat', 'mũ', '戴帽子'],
  ['裙子', 'qúnzi', 'skirt', 'váy', '穿裙子'],
  ['外套', 'wàitào', 'coat', 'áo khoác', '穿外套'],
  ['袜子', 'wàzi', 'socks', 'vớ; tất', '穿袜子'],
  ['衬衫', 'chènshān', 'shirt', 'áo sơ mi', '穿衬衫'],
  // Countries & cities
  ['中国', 'Zhōngguó', 'China', 'Trung Quốc', '我住在中国'],
  ['美国', 'Měiguó', 'USA', 'Mỹ', '他去美国'],
  ['英国', 'Yīngguó', 'UK', 'Anh', '她从英国来'],
  ['法国', 'Fǎguó', 'France', 'Pháp', '法国很美'],
  ['德国', 'Déguó', 'Germany', 'Đức', '德国在欧洲'],
  ['日本', 'Rìběn', 'Japan', 'Nhật Bản', '我喜欢日本文化'],
  ['韩国', 'Hánguó', 'Korea', 'Hàn Quốc', '韩国料理很好吃'],
  ['越南', 'Yuènán', 'Vietnam', 'Việt Nam', '他去越南旅行'],
  ['北京', 'Běijīng', 'Beijing', 'Bắc Kinh', '北京是首都'],
  ['上海', 'Shànghǎi', 'Shanghai', 'Thượng Hải', '上海很繁华'],
  ['广州', 'Guǎngzhōu', 'Guangzhou', 'Quảng Châu', '广州在南方'],
  ['深圳', 'Shēnzhèn', 'Shenzhen', 'Thâm Quyến', '深圳发展很快'],
  // Health
  ['医生', 'yīshēng', 'doctor', 'bác sĩ', '医生在医院'],
  ['护士', 'hùshi', 'nurse', 'y tá', '护士很细心'],
  ['生病', 'shēngbìng', 'to get sick', 'bị bệnh', '他生病了'],
  ['药', 'yào', 'medicine', 'thuốc', '吃药'],
  ['看病', 'kànbìng', 'see a doctor', 'khám bệnh', '去医院看病'],
  // Hobbies & sports
  ['音乐', 'yīnyuè', 'music', 'âm nhạc', '我喜欢音乐'],
  ['跳舞', 'tiàowǔ', 'to dance', 'nhảy múa', '她喜欢跳舞'],
  ['唱歌', 'chànggē', 'to sing', 'hát', '他会唱歌'],
  ['电影', 'diànyǐng', 'movie', 'phim', '看电影'],
  ['体育', 'tǐyù', 'sports', 'thể thao', '体育课'],
  ['运动', 'yùndòng', 'sports; exercise', 'vận động', '我们做运动'],
  ['足球', 'zúqiú', 'football (soccer)', 'bóng đá', '踢足球'],
  ['篮球', 'lánqiú', 'basketball', 'bóng rổ', '打篮球'],
  ['乒乓球', 'pīngpāngqiú', 'ping pong', 'bóng bàn', '打乒乓球'],
  // Misc
  ['中国菜', 'Zhōngguó cài', 'Chinese food', 'món ăn Trung Quốc', '我喜欢中国菜'],
  ['汉语', 'Hànyǔ', 'Chinese (language)', 'tiếng Hoa', '我们学汉语'],
  ['中文', 'Zhōngwén', 'Chinese (written)', 'tiếng Trung', '中文很有趣'],
  ['英语', 'Yīngyǔ', 'English', 'tiếng Anh', '她会说英语'],
  ['名字', 'míngzi', 'name', 'tên', '你的名字是什么'],
  ['年龄', 'niánlíng', 'age', 'tuổi', '你的年龄是多少'],
  ['生日', 'shēngrì', 'birthday', 'sinh nhật', '今天是我的生日'],
  ['礼物', 'lǐwù', 'gift', 'quà', '收到礼物'],
];

// Generate numbers 0-200
const numberMap = {
  0: ['零', 'líng', 'zero', 'không'],
  1: ['一', 'yī', 'one', 'một'],
  2: ['二', 'èr', 'two', 'hai'],
  3: ['三', 'sān', 'three', 'ba'],
  4: ['四', 'sì', 'four', 'bốn'],
  5: ['五', 'wǔ', 'five', 'năm'],
  6: ['六', 'liù', 'six', 'sáu'],
  7: ['七', 'qī', 'seven', 'bảy'],
  8: ['八', 'bā', 'eight', 'tám'],
  9: ['九', 'jiǔ', 'nine', 'chín'],
  10: ['十', 'shí', 'ten', 'mười'],
};

function numToHanzi(n) {
  if (n <= 10) return numberMap[n][0];
  if (n < 20) return '十' + numberMap[n - 10][0];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return (tens === 1 ? '十' : numberMap[tens][0] + '十') + (ones === 0 ? '' : numberMap[ones][0]);
  }
  if (n === 100) return '一百';
  if (n < 200) {
    const rest = n - 100;
    if (rest === 0) return '一百';
    if (rest < 10) return '一百零' + numberMap[rest][0];
    return '一百' + numToHanzi(rest);
  }
  return String(n);
}

function numToPinyin(n) {
  const base = {
    0: 'líng', 1: 'yī', 2: 'èr', 3: 'sān', 4: 'sì', 5: 'wǔ', 6: 'liù', 7: 'qī', 8: 'bā', 9: 'jiǔ', 10: 'shí',
  };
  if (n <= 10) return base[n];
  if (n < 20) return 'shí' + base[n - 10];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const tensPart = tens === 1 ? 'shí' : base[tens] + 'shí';
    const onesPart = ones === 0 ? '' : base[ones];
    return tensPart + onesPart;
  }
  if (n === 100) return 'yìbǎi';
  if (n < 200) {
    const rest = n - 100;
    if (rest === 0) return 'yìbǎi';
    if (rest < 10) return 'yìbǎi líng ' + base[rest];
    return 'yìbǎi ' + numToPinyin(rest);
  }
  return String(n);
}

function buildNumberItems(max = 200) {
  const items = [];
  for (let i = 0; i <= max; i++) {
    const hz = numToHanzi(i);
    const py = numToPinyin(i);
    const en = i === 0 ? 'zero' : i.toString();
    const vi = i === 0 ? 'không' : i.toString();
    items.push(item(hz, py, en, vi, `我有${hz}本书`));
  }
  return items;
}

// Days of week 星期一..星期天
function buildDaysOfWeek() {
  const days = [
    ['星期一', 'xīngqīyī', 'Monday', 'thứ hai'],
    ['星期二', 'xīngqī’èr', 'Tuesday', 'thứ ba'],
    ['星期三', 'xīngqīsān', 'Wednesday', 'thứ tư'],
    ['星期四', 'xīngqīsì', 'Thursday', 'thứ năm'],
    ['星期五', 'xīngqīwǔ', 'Friday', 'thứ sáu'],
    ['星期六', 'xīngqīliù', 'Saturday', 'thứ bảy'],
    ['星期天', 'xīngqītiān', 'Sunday', 'chủ nhật'],
  ];
  return days.map(([hz, py, en, vi]) => item(hz, py, en, vi, `今天是${hz}`));
}

// Months 一月..十二月
function buildMonths() {
  const months = [];
  const basePy = ['yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ', 'shí', 'shíyī', 'shí’èr'];
  const enNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  for (let m = 1; m <= 12; m++) {
    const hz = numToHanzi(m) + '月';
    const py = basePy[m - 1] + 'yuè';
    const en = enNames[m - 1];
    const vi = `tháng ${m}`;
    months.push(item(hz, py, en, vi, `${hz}我的生日`));
  }
  return months;
}

// Compose final list
function buildAll() {
  const list = [];
  // base words
  baseWords.forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));
  // numbers 0-500
  buildNumberItems(500).forEach(it => list.push(it));
  // days & months
  buildDaysOfWeek().forEach(it => list.push(it));
  buildMonths().forEach(it => list.push(it));
  // more verbs
  [
    ['开', 'kāi', 'to open; start', 'mở; bắt đầu', '开门'],
    ['关', 'guān', 'to close; shut', 'đóng', '关灯'],
    ['穿', 'chuān', 'to wear', 'mặc', '穿衣服'],
    ['脱', 'tuō', 'to take off', 'cởi', '脱外套'],
    ['买', 'mǎi', 'to buy', 'mua', '买东西'],
    ['卖', 'mài', 'to sell', 'bán', '卖书'],
    ['给', 'gěi', 'to give', 'cho; tặng', '给你礼物'],
    ['拿', 'ná', 'to take; hold', 'cầm; lấy', '拿铅笔'],
    ['放', 'fàng', 'to put; place', 'đặt; để', '把书放桌子上'],
    ['找', 'zhǎo', 'to look for', 'tìm', '找朋友'],
    ['等', 'děng', 'to wait', 'đợi', '等一会儿'],
    ['叫', 'jiào', 'to call', 'gọi', '叫他过来'],
    ['帮助', 'bāngzhù', 'to help', 'giúp đỡ', '帮助同学'],
    ['认识', 'rènshi', 'to know (someone)', 'biết (người)', '我认识他'],
    ['了解', 'liǎojiě', 'to understand', 'hiểu', '了解情况'],
    ['记得', 'jìde', 'to remember', 'nhớ', '我记得名字'],
    ['忘记', 'wàngjì', 'to forget', 'quên', '别忘记作业'],
    ['打开', 'dǎkāi', 'to open', 'mở', '打开书'],
    ['关闭', 'guānbì', 'to close', 'đóng', '关闭电视'],
    ['参加', 'cānjiā', 'to participate', 'tham gia', '参加比赛'],
    ['练习', 'liànxí', 'to practice', 'luyện tập', '练习写字'],
    ['教', 'jiāo', 'to teach', 'dạy', '老师教我们'],
    ['休息', 'xiūxi', 'to rest', 'nghỉ ngơi', '休息一下'],
    ['工作', 'gōngzuò', 'to work', 'làm việc', '妈妈在工作'],
    ['上班', 'shàngbān', 'to go to work', 'đi làm', '爸爸上班了'],
    ['下班', 'xiàbān', 'to finish work', 'tan làm', '他六点下班'],
    ['上课', 'shàngkè', 'to have class', 'lên lớp', '我们八点上课'],
    ['下课', 'xiàkè', 'to finish class', 'tan học', '十点下课'],
    ['游泳', 'yóuyǒng', 'to swim', 'bơi', '在池里游泳'],
    ['洗澡', 'xǐzǎo', 'to bathe', 'tắm', '晚上洗澡'],
    ['刷牙', 'shuāyá', 'to brush teeth', 'đánh răng', '每天刷牙'],
    ['洗手', 'xǐshǒu', 'to wash hands', 'rửa tay', '吃饭前洗手'],
    ['做饭', 'zuòfàn', 'to cook', 'nấu ăn', '妈妈做饭'],
    ['切菜', 'qiēcài', 'to cut vegetables', 'xắt rau', '切菜很快'],
    ['打扫', 'dǎsǎo', 'to clean', 'dọn dẹp', '打扫房间'],
    ['扫地', 'sǎodì', 'to sweep the floor', 'quét nhà', '用扫把扫地'],
    ['擦桌子', 'cā zhuōzi', 'to wipe table', 'lau bàn', '擦桌子很干净'],
    ['借', 'jiè', 'to borrow', 'mượn', '借一本书'],
    ['还', 'huán', 'to return (borrowed)', 'trả', '还书'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // more adjectives
  [
    ['漂亮', 'piàoliang', 'pretty', 'đẹp', '她很漂亮'],
    ['可爱', 'kě’ài', 'cute', 'dễ thương', '小猫很可爱'],
    ['聪明', 'cōngmíng', 'smart', 'thông minh', '他很聪明'],
    ['勤劳', 'qínláo', 'hardworking', 'chăm chỉ', '她很勤劳'],
    ['懒惰', 'lǎnduò', 'lazy', 'lười biếng', '不要懒惰'],
    ['安静', 'ānjìng', 'quiet', 'yên tĩnh', '教室要安静'],
    ['热闹', 'rènao', 'lively', 'náo nhiệt', '公园很热闹'],
    ['干净', 'gānjìng', 'clean', 'sạch sẽ', '房间很干净'],
    ['脏', 'zāng', 'dirty', 'bẩn', '衣服很脏'],
    ['甜', 'tián', 'sweet', 'ngọt', '水果很甜'],
    ['苦', 'kǔ', 'bitter', 'đắng', '药很苦'],
    ['酸', 'suān', 'sour', 'chua', '柠檬很酸'],
    ['咸', 'xián', 'salty', 'mặn', '汤有点咸'],
    ['香', 'xiāng', 'fragrant', 'thơm', '花很香'],
    ['软', 'ruǎn', 'soft', 'mềm', '床很软'],
    ['硬', 'yìng', 'hard', 'cứng', '桌子很硬'],
    ['轻', 'qīng', 'light (weight)', 'nhẹ', '书包很轻'],
    ['重', 'zhòng', 'heavy', 'nặng', '箱子很重'],
    ['长', 'cháng', 'long', 'dài', '头发很长'],
    ['短', 'duǎn', 'short', 'ngắn', '裤子很短'],
    ['宽', 'kuān', 'wide', 'rộng', '路很宽'],
    ['窄', 'zhǎi', 'narrow', 'hẹp', '路很窄'],
    ['亮', 'liàng', 'bright', 'sáng', '灯很亮'],
    ['暗', 'àn', 'dark; dim', 'tối', '房间很暗'],
    ['开心', 'kāixīn', 'happy', 'vui vẻ', '孩子很开心'],
    ['难过', 'nánguò', 'sad', 'buồn', '他很难过'],
    ['害怕', 'hàipà', 'afraid', 'sợ hãi', '不要害怕'],
    ['生气', 'shēngqì', 'angry', 'tức giận', '她生气了'],
    ['安全', 'ānquán', 'safe', 'an toàn', '这里很安全'],
    ['危险', 'wēixiǎn', 'dangerous', 'nguy hiểm', '那里很危险'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // Household items
  [
    ['电视机', 'diànshìjī', 'television set', 'máy tivi', '家里有电视机'],
    ['遥控器', 'yáokòngqì', 'remote control', 'điều khiển', '找遥控器'],
    ['电风扇', 'diànfēngshàn', 'electric fan', 'quạt điện', '开电风扇'],
    ['洗衣机', 'xǐyījī', 'washing machine', 'máy giặt', '用洗衣机洗衣服'],
    ['微波炉', 'wēibōlú', 'microwave oven', 'lò vi sóng', '用微波炉热饭'],
    ['烤箱', 'kǎoxiāng', 'oven', 'lò nướng', '烤箱烤面包'],
    ['电饭锅', 'diànfànguō', 'rice cooker', 'nồi cơm điện', '电饭锅煮饭'],
    ['锅', 'guō', 'pot', 'nồi', '用锅做饭'],
    ['碗', 'wǎn', 'bowl', 'bát', '一个碗'],
    ['盘子', 'pánzi', 'plate', 'đĩa', '三个盘子'],
    ['勺子', 'sháozi', 'spoon', 'muỗng', '用勺子喝汤'],
    ['刀', 'dāo', 'knife', 'dao', '用刀切菜'],
    ['叉子', 'chāzi', 'fork', 'nĩa', '用叉子吃饭'],
    ['牙刷', 'yáshuā', 'toothbrush', 'bàn chải', '用牙刷刷牙'],
    ['牙膏', 'yágāo', 'toothpaste', 'kem đánh răng', '牙膏用完了'],
    ['毛巾', 'máojīn', 'towel', 'khăn tắm', '用毛巾擦手'],
    ['肥皂', 'féizào', 'soap', 'xà phòng', '用肥皂洗手'],
    ['洗发水', 'xǐfàshuǐ', 'shampoo', 'dầu gội', '用洗发水洗头'],
    ['梳子', 'shūzi', 'comb', 'lược', '用梳子梳头'],
    ['书架', 'shūjià', 'bookshelf', 'kệ sách', '书架上有书'],
    ['画', 'huà', 'painting; picture', 'bức tranh', '墙上有画'],
    ['照片', 'zhàopiàn', 'photo', 'ảnh', '看照片'],
    ['钟', 'zhōng', 'clock', 'đồng hồ treo tường', '墙上有钟'],
    ['表', 'biǎo', 'watch', 'đồng hồ đeo tay', '戴表'],
    ['镜子', 'jìngzi', 'mirror', 'gương', '照镜子'],
    ['垃圾桶', 'lājītǒng', 'trash bin', 'thùng rác', '把垃圾放进垃圾桶'],
    ['地毯', 'dìtǎn', 'carpet', 'thảm', '地毯很软'],
    ['窗帘', 'chuānglián', 'curtain', 'rèm cửa', '拉窗帘'],
    ['花瓶', 'huāpíng', 'vase', 'bình hoa', '桌上有花瓶'],
    ['钥匙', 'yàoshi', 'key', 'chìa khóa', '拿钥匙'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // City places
  [
    ['书店', 'shūdiàn', 'bookstore', 'hiệu sách', '去书店买书'],
    ['面包店', 'miànbāodiàn', 'bakery', 'tiệm bánh', '面包店很香'],
    ['药店', 'yàodiàn', 'pharmacy', 'hiệu thuốc', '去药店买药'],
    ['花店', 'huādiàn', 'flower shop', 'tiệm hoa', '花店有很多花'],
    ['玩具店', 'wánjùdiàn', 'toy store', 'cửa hàng đồ chơi', '孩子去玩具店'],
    ['文具店', 'wénjùdiàn', 'stationery shop', 'văn phòng phẩm', '买笔在文具店'],
    ['警察局', 'jǐngchájú', 'police station', 'đồn cảnh sát', '去警察局'],
    ['消防站', 'xiāofángzhàn', 'fire station', 'trạm cứu hỏa', '消防站工作'],
    ['博物馆', 'bówùguǎn', 'museum', 'bảo tàng', '去博物馆参观'],
    ['动物园', 'dòngwùyuán', 'zoo', 'sở thú', '周末去动物园'],
    ['水族馆', 'shuǐzúguǎn', 'aquarium', 'thủy cung', '水族馆看鱼'],
    ['电影院', 'diànyǐngyuàn', 'cinema', 'rạp chiếu phim', '在电影院看电影'],
    ['体育馆', 'tǐyùguǎn', 'gymnasium', 'nhà thi đấu', '去体育馆打球'],
    ['游泳池', 'yóuyǒngchí', 'swimming pool', 'hồ bơi', '在游泳池游泳'],
    ['火车站', 'huǒchēzhàn', 'train station', 'ga tàu', '到火车站'],
    ['机场', 'jīchǎng', 'airport', 'sân bay', '去机场接人'],
    ['港口', 'gǎngkǒu', 'port; harbor', 'cảng', '港口有很多船'],
    ['市场', 'shìchǎng', 'market', 'chợ', '去市场买菜'],
    ['菜市场', 'càishìchǎng', 'vegetable market', 'chợ rau', '菜市场很热闹'],
    ['医务室', 'yīwùshì', 'medical room', 'phòng y tế', '学校有医务室'],
    ['幼儿园', 'yòu’éryuán', 'kindergarten', 'mẫu giáo', '孩子上幼儿园'],
    ['小学', 'xiǎoxué', 'primary school', 'tiểu học', '我在小学'],
    ['中学', 'zhōngxué', 'middle school', 'trung học cơ sở', '她在中学'],
    ['高中', 'gāozhōng', 'high school', 'trung học phổ thông', '他们在高中'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // School subjects
  [
    ['数学', 'shùxué', 'mathematics', 'toán học', '我学数学'],
    ['语文', 'yǔwén', 'Chinese (subject)', 'ngữ văn (TQ)', '上语文课'],
    ['英语', 'yīngyǔ', 'English (subject)', 'tiếng Anh', '英语课很有趣'],
    ['科学', 'kēxué', 'science', 'khoa học', '我们学科学'],
    ['音乐', 'yīnyuè', 'music', 'âm nhạc', '音乐课唱歌'],
    ['美术', 'měishù', 'art', 'mỹ thuật', '美术课画画'],
    ['体育', 'tǐyù', 'PE; sports', 'thể dục', '体育课跑步'],
    ['历史', 'lìshǐ', 'history', 'lịch sử', '学习历史'],
    ['地理', 'dìlǐ', 'geography', 'địa lý', '地理很有意思'],
    ['生物', 'shēngwù', 'biology', 'sinh học', '生物课'],
    ['计算机', 'jìsuànjī', 'computer science', 'tin học', '学计算机'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // More animals
  [
    ['鲸鱼', 'jīngyú', 'whale', 'cá voi', '鲸鱼在海里'],
    ['海豚', 'hǎitún', 'dolphin', 'cá heo', '海豚很聪明'],
    ['海狮', 'hǎishī', 'sea lion', 'sư tử biển', '海狮会表演'],
    ['海龟', 'hǎiguī', 'sea turtle', 'rùa biển', '海龟游得慢'],
    ['蛇', 'shé', 'snake', 'rắn', '蛇在草里'],
    ['蜥蜴', 'xīyì', 'lizard', 'thằn lằn', '蜥蜴爬墙'],
    ['青蛙', 'qīngwā', 'frog', 'ếch', '青蛙会跳'],
    ['乌龟', 'wūguī', 'turtle', 'rùa', '乌龟很慢'],
    ['熊猫', 'xióngmāo', 'panda', 'gấu trúc', '熊猫很可爱'],
    ['狐狸', 'húlí', 'fox', 'cáo', '狐狸很聪明'],
    ['狼', 'láng', 'wolf', 'sói', '狼在山里'],
    ['鹿', 'lù', 'deer', 'hươu', '鹿跑得快'],
    ['斑马', 'bānmǎ', 'zebra', 'ngựa vằn', '斑马有条纹'],
    ['长颈鹿', 'chángjǐnglù', 'giraffe', 'hươu cao cổ', '长颈鹿很高'],
    ['袋鼠', 'dàishǔ', 'kangaroo', 'chuột túi', '袋鼠会跳'],
    ['考拉', 'kǎolā', 'koala', 'gấu túi', '考拉在树上'],
    ['老鼠', 'lǎoshǔ', 'mouse; rat', 'chuột', '老鼠很小'],
    ['麻雀', 'máquè', 'sparrow', 'chim sẻ', '麻雀在树上'],
    ['鹦鹉', 'yīngwǔ', 'parrot', 'chim két', '鹦鹉会说话'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // More foods
  [
    ['饺子', 'jiǎozi', 'dumplings', 'bánh há cảo', '吃饺子'],
    ['包子', 'bāozi', 'steamed bun', 'bánh bao', '买包子'],
    ['米粉', 'mǐfěn', 'rice noodles', 'bún', '吃米粉'],
    ['粥', 'zhōu', 'porridge', 'cháo', '喝粥'],
    ['豆浆', 'dòujiāng', 'soy milk', 'sữa đậu nành', '喝豆浆'],
    ['豆腐', 'dòufu', 'tofu', 'đậu phụ', '豆腐很嫩'],
    ['蛋糕', 'dàngāo', 'cake', 'bánh kem', '吃蛋糕'],
    ['饼干', 'bǐnggān', 'cookies; biscuits', 'bánh quy', '吃饼干'],
    ['巧克力', 'qiǎokèlì', 'chocolate', 'sô cô la', '巧克力很甜'],
    ['冰淇淋', 'bīngqílín', 'ice cream', 'kem', '吃冰淇淋'],
    ['果汁', 'guǒzhī', 'fruit juice', 'nước trái cây', '喝果汁'],
    ['酸奶', 'suānnǎi', 'yogurt', 'sữa chua', '喝酸奶'],
    ['茶叶', 'cháyè', 'tea leaves', 'lá trà', '泡茶叶'],
    ['咖啡豆', 'kāfēidòu', 'coffee beans', 'hạt cà phê', '磨咖啡豆'],
    ['橄榄油', 'gǎnlǎnyóu', 'olive oil', 'dầu ô liu', '用橄榄油做菜'],
    ['黄油', 'huángyóu', 'butter', 'bơ', '黄油很香'],
    ['蜂蜜', 'fēngmì', 'honey', 'mật ong', '蜂蜜很甜'],
    ['盐', 'yán', 'salt', 'muối', '放盐'],
    ['胡椒', 'hújiāo', 'pepper', 'tiêu', '加胡椒'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // Transport infrastructure
  [
    ['红绿灯', 'hónglǜdēng', 'traffic light', 'đèn giao thông', '看红绿灯'],
    ['十字路口', 'shízìlùkǒu', 'crossroads', 'ngã tư đường', '到十字路口'],
    ['人行道', 'rénxíngdào', 'sidewalk', 'vỉa hè', '走在人行道上'],
    ['天桥', 'tiānqiáo', 'footbridge', 'cầu vượt', '过天桥'],
    ['地下通道', 'dìxià tōngdào', 'underpass', 'hầm đi bộ', '走地下通道'],
    ['单车道', 'dān chēdào', 'single lane', 'làn đơn', '这条路是单车道'],
    ['停车场', 'tíngchēchǎng', 'parking lot', 'bãi đỗ xe', '在停车场停车'],
    ['加油站', 'jiāyóuzhàn', 'gas station', 'trạm xăng', '去加油站加油'],
    ['公交站', 'gōngjiāo zhàn', 'bus stop', 'trạm xe buýt', '在公交站等车'],
    ['地铁站', 'dìtiězhàn', 'subway station', 'ga tàu điện ngầm', '到地铁站'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // More countries
  [
    ['意大利', 'Yìdàlì', 'Italy', 'Ý', '他去意大利'],
    ['西班牙', 'Xībānyá', 'Spain', 'Tây Ban Nha', '我们喜欢西班牙'],
    ['葡萄牙', 'Pútáoyá', 'Portugal', 'Bồ Đào Nha', '葡萄牙在欧洲'],
    ['荷兰', 'Hélán', 'Netherlands', 'Hà Lan', '荷兰有很多花'],
    ['瑞典', 'Ruìdiǎn', 'Sweden', 'Thụy Điển', '瑞典很冷'],
    ['挪威', 'Nuówēi', 'Norway', 'Na Uy', '挪威在北方'],
    ['丹麦', 'Dānmài', 'Denmark', 'Đan Mạch', '丹麦很漂亮'],
    ['俄罗斯', 'Éluósī', 'Russia', 'Nga', '俄罗斯很大'],
    ['乌克兰', 'Wūkèlán', 'Ukraine', 'Ukraina', '乌克兰在欧洲'],
    ['波兰', 'Bōlán', 'Poland', 'Ba Lan', '波兰有历史'],
    ['捷克', 'Jiékè', 'Czechia', 'Séc', '捷克很美'],
    ['匈牙利', 'Xiōngyálì', 'Hungary', 'Hungary', '匈牙利在欧洲'],
    ['瑞士', 'Ruìshì', 'Switzerland', 'Thụy Sĩ', '瑞士有山'],
    ['奥地利', 'Àodìlì', 'Austria', 'Áo', '奥地利很安静'],
    ['澳大利亚', 'Àodàlìyà', 'Australia', 'Úc', '去澳大利亚看袋鼠'],
    ['新西兰', 'Xīnxīlán', 'New Zealand', 'New Zealand', '新西兰很美'],
    ['加拿大', 'Jiānádà', 'Canada', 'Canada', '加拿大很大'],
    ['墨西哥', 'Mòxīgē', 'Mexico', 'Mexico', '墨西哥很热闹'],
    ['巴西', 'Bāxī', 'Brazil', 'Brazil', '巴西在南美'],
    ['阿根廷', 'Āgēntíng', 'Argentina', 'Argentina', '阿根廷踢足球'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // Extra body parts
  [
    ['肩膀', 'jiānbǎng', 'shoulder', 'vai', '肩膀很酸'],
    ['胳膊', 'gēbo', 'arm', 'cánh tay', '胳膊受伤了'],
    ['手腕', 'shǒuwàn', 'wrist', 'cổ tay', '手腕疼'],
    ['手背', 'shǒubèi', 'back of hand', 'mu bàn tay', '手背干净'],
    ['手掌', 'shǒuzhǎng', 'palm', 'lòng bàn tay', '手掌很暖'],
    ['大腿', 'dàtuǐ', 'thigh', 'đùi', '大腿很累'],
    ['小腿', 'xiǎotuǐ', 'calf', 'bắp chân', '小腿酸痛'],
    ['膝盖', 'xīgài', 'knee', 'đầu gối', '膝盖有点疼'],
    ['脚踝', 'jiǎohuái', 'ankle', 'mắt cá chân', '脚踝扭了'],
    ['脚趾', 'jiǎozhǐ', 'toe', 'ngón chân', '脚趾很冷'],
    ['心脏', 'xīnzàng', 'heart', 'trái tim', '心脏很强'],
    ['肺', 'fèi', 'lung', 'phổi', '肺很健康'],
    ['肝', 'gān', 'liver', 'gan', '保护肝'],
    ['胃', 'wèi', 'stomach', 'dạ dày', '胃不舒服'],
    ['皮肤', 'pífū', 'skin', 'da', '皮肤很好'],
    ['指甲', 'zhǐjiǎ', 'nail', 'móng tay', '剪指甲'],
    ['眉毛', 'méimáo', 'eyebrow', 'lông mày', '眉毛很浓'],
    ['睫毛', 'jiémáo', 'eyelash', 'lông mi', '睫毛很长'],
    ['舌头', 'shétou', 'tongue', 'lưỡi', '舌头尝味道'],
    ['喉咙', 'hóulóng', 'throat', 'cổ họng', '喉咙疼'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // Extra clothes
  [
    ['外衣', 'wàiyī', 'outerwear', 'áo ngoài', '穿外衣'],
    ['内衣', 'nèiyī', 'underwear', 'đồ lót', '买内衣'],
    ['运动鞋', 'yùndòngxié', 'sports shoes', 'giày thể thao', '穿运动鞋'],
    ['凉鞋', 'liángxié', 'sandals', 'dép', '穿凉鞋'],
    ['雨衣', 'yǔyī', 'raincoat', 'áo mưa', '穿雨衣'],
    ['围巾', 'wéijīn', 'scarf', 'khăn choàng', '戴围巾'],
    ['手套', 'shǒutào', 'gloves', 'găng tay', '戴手套'],
    ['腰带', 'yāodài', 'belt', 'dây nịt', '系腰带'],
    ['皮鞋', 'píxié', 'leather shoes', 'giày da', '穿皮鞋'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // Extra weather
  [
    ['阴', 'yīn', 'overcast', 'âm u', '今天是阴天'],
    ['雾', 'wù', 'fog', 'sương mù', '早上有雾'],
    ['雷', 'léi', 'thunder', 'sấm', '打雷了'],
    ['电', 'diàn', 'lightning', 'chớp', '闪电很亮'],
    ['彩虹', 'cǎihóng', 'rainbow', 'cầu vồng', '看到彩虹'],
    ['温度', 'wēndù', 'temperature', 'nhiệt độ', '温度很高'],
    ['天气预报', 'tiānqì yùbào', 'weather forecast', 'dự báo thời tiết', '看天气预报'],
    ['下雨', 'xià yǔ', 'to rain', 'mưa', '外面下雨'],
    ['下雪', 'xià xuě', 'to snow', 'tuyết rơi', '冬天下雪'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));

  // School & office tools
  [
    ['铅笔刀', 'qiānbǐdāo', 'pencil sharpener', 'gọt bút chì', '用铅笔刀'],
    ['橡皮', 'xiàngpí', 'eraser', 'cục tẩy', '用橡皮擦字'],
    ['尺子', 'chǐzi', 'ruler', 'thước kẻ', '用尺子画线'],
    ['胶水', 'jiāoshuǐ', 'glue', 'keo dán', '用胶水'],
    ['胶带', 'jiāodài', 'tape', 'băng dính', '用胶带'],
    ['锤子', 'chuízi', 'hammer', 'búa', '用锤子敲钉子'],
    ['螺丝刀', 'luósīdāo', 'screwdriver', 'tua vít', '用螺丝刀拧螺丝'],
    ['钳子', 'qiánzi', 'pliers', 'kìm', '用钳子夹住'],
    ['画笔', 'huàbǐ', 'paintbrush', 'bút vẽ', '用画笔画画'],
    ['颜料', 'yánliào', 'paint', 'sơn; màu vẽ', '用颜料涂色'],
    ['彩色笔', 'cǎisèbǐ', 'color pens', 'bút màu', '用彩色笔'],
    ['订书机', 'dìngshūjī', 'stapler', 'kim bấm', '用订书机订纸'],
    ['订书钉', 'dìngshūdīng', 'staples', 'ghim bấm', '加订书钉'],
    ['文件夹', 'wénjiànjiā', 'folder', 'bìa hồ sơ', '放在文件夹里'],
    ['信封', 'xìnfēng', 'envelope', 'phong bì', '把信放进信封'],
  ].forEach(([hz, py, en, vi, ex]) => list.push(item(hz, py, en, vi, ex)));
  // Deduplicate by hanzi
  const seen = new Set();
  const dedup = [];
  for (const it of list) {
    if (!seen.has(it.hanzi)) {
      seen.add(it.hanzi);
      dedup.push(it);
    }
  }
  return dedup;
}

function main() {
  const out = buildAll();
  const outPath = path.join(__dirname, '..', 'data', 'hsk1_words.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} items to ${outPath}`);
}

if (require.main === module) {
  main();
}
