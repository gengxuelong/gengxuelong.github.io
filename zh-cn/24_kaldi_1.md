## Kaldi v1

<!-- 语音识别常用的工具：https://mp.weixin.qq.com/s/ZFD2mUAC1B6ZH5JEf5yJmg -->
<!-- https://edu.speechhome.com/p/t_pc/course_pc_detail/video/v_628738dce4b09dda126afe52?product_id=course_29PxU67tXQ4UUKanZ65QK2ovY2d -->

<!-- https://edu.speechhome.com/p/t_pc/course_pc_detail/camp_pro/course_29PxU67tXQ4UUKanZ65QK2ovY2d -->

<!-- https://github.com/du-ud/kaldi-cslt -->

关于Kaldi的学习，我推荐大家阅读以下3本书和语音之家的公开课，笔者关于Kaldi的学习也来源于此：

| 《语音识别基本法 Kaldi实践与探索》 | 《Kaldi语音识别实战》 | 《语音识别原理与应用》 |
| ---------------------------------- | --------------------- | ---------------------- |
|  <img src="zh-cn/img/ch28/p1.png"   /> |  <img src="zh-cn/img/ch28/p2.png"   />|  <img src="zh-cn/img/ch28/p3.png"   /> |


也可也学习语音之家开源的公开课：

+ [Kaldi语音识别理论与实践](https://edu.speechhome.com/p/t_pc/course_pc_detail/camp_pro/course_29PxU67tXQ4UUKanZ65QK2ovY2d)

为了深入研究Kaldi我们在这里继续进行传统语音识别技术的介绍，包括**语音编码**,**语音特征提取**,**再谈GMM-HMM**,**再谈DNN-HMM**,**音素的上下文建模**,**静音检测**,**i-vector,x-vector**

### 1.语音编码

<!-- 本周4完成 -->

声波通过空气传播，被麦克风接收，再被转换为模拟的语音信号，如下图所示。这些信号经过采样，变成离散的时间信号，再进一步经过量化，被保存为数字信号，即波形文件

<div align=center>
    <img src="zh-cn/img/ch28/p4.jpg"   /> 
</div>

我们将在本节介绍声波的特性，声音的采集装置（麦克风），声音的采样和量化，最后介绍语音文件的格式和分析。


#### 1.1 声波的特性

声波在空气中是一种纵波，他的震动方向和传播方向是一致的。声音在空气中的振动形成压力波动，产生压强，再经过传感器接收转换，变成时变的电压信号。

声波的特性主要包括频率和声强。频率是指在单位时间内声波的周期数，而直接测量声强较为困难，故常用声压来衡量声音的强弱。某一瞬间介质中的压强相对于无声波时的改变量称为声压，记为$p(t)$,单位是$Pa$

由于人耳感知的声压动态范围太大，加之人耳对声音大小的感觉近似的与声压，声强呈对数关系，所以通常用对数值来度量声音。一般把很小的声压$p_0=2\times 10^{-5}Pa$作为参考声压，把所要测量的声压$p$与参考声压$p_0$的比值取常用对数后，乘以20得到的数称为声压级（SPL),其单位是分贝(dB)

$$SPL=20log(\frac{p}{p_0}) dB$$

国家标准规定，住宅区的噪音大小为白天不能超过50dB,夜间应低于45dB。注意，衡量声音的信噪比（SNR)的单位也用分贝，其数值越高，表示声音越干净，噪声比例越小。

#### 1.2 声音的接收装置

麦克风包括动圈式和电容式2种，其中动圈式麦克风精度，灵敏度较低，体积大，其突出特点是输出阻抗小，所以接较长的电缆也不降低其灵敏度，且温度和湿度的变化对其灵敏度没有大影响，适用于广播，扩声系统。电容式的麦克风音质好，灵敏度高，但常需要电源，适用于舞台，录音室内等。

驻极体麦克风是电容式的一种，无需外加电源，其体积小，使用较广泛。驻极体麦克风包含以下两种类型。

+ 振膜式：带电体是驻极体振膜本身，话筒拾声的音质效果相对较差，多用于在对于音质效果要求不高的场合，如普通的电话机，玩具等
+ 背级式：带电体是涂敷在背极板上的驻极体膜层，与振膜分离设计，手机， 语音识别等高端传声录音产品多采用背极式驻极体。

随着现代生产工艺的发展，现代工业上广泛采用MEMS麦克风。MEMS麦克风从原理上依然属于电容式麦克风，其中一个电容器集成在微硅晶片上，可以采用表贴工艺进行制造。MEMS麦克风的优点是一致性比较好，特别适用于在中高端手机应用中，也适用于进行远场语音交互的麦克风阵列。

麦克风主要包括以下性能指标：

+ 指向性

麦克风对于不同方向的声音灵敏度，称为麦克风的指向性，指向性用于麦克风正面0度方向和背面180度方向上的灵敏度的差值来表示，差值大于15dB称为强方向性麦克风。全指向性麦克风从各个方向拾取声音的性能一致。当说话的人要来回走动时采用此类麦克风较为合适，但是在环境噪声大的条件下不宜采用。心形指向麦克风的灵敏度在水平方向呈心脏形，正面灵敏度最大，侧面稍小，背面最小。这种麦克风在多种扩音系统中都有优秀的表现。单指向性麦克风又称为超心形指向性麦克风，他的指向性比心形麦克风更尖锐，正面灵敏度极高，其他方向的灵敏度急剧衰减，特别适用于高噪音的环境。

+ 频率响应

表示麦克风拾音的频率范围，以及在此范围内对声音各频率的灵敏度。一般来说，频率范围越宽，频率曲线越平直越好。

+ 灵敏度

在单位声压激励下，输出电压与输入电压的比值，单位为$mV/Pa$。实际衡量采用相对值，以分贝表示，并规定$1V/Pa$为0dB。因话筒输出一般是毫伏级，所以其灵敏度的分贝值始终为负值。

+ 输出阻抗

目前常见的麦克风为高阻抗或低阻抗之分，高阻抗一般在$2k\Omega\~3l\Omega$以上，低阻抗一般在$1k\Omega$以下。高阻抗麦克风灵敏度高；低阻抗的麦克风适合长距离采集传输，连接线即使拉的长一些，也不会改变其特性，音质几乎没有变化，也很少受外界信号干扰。

**麦克风阵列**

对于远距离识别(也成远场识别)，用一个麦克风采集语音是不够的，无法判断方位和语音增强，需要采用麦克风阵列。麦克风阵列采用两个或多个以上的麦克风，如亚马逊的Echo音响采用了6+1麦克风阵列

<div align=center>
    <img src="zh-cn/img/ch28/p5.png"   /> 
</div>

麦克风阵列有线形，圆形等多种排列方式，主要实现以下功能：
+ 语音增强
+ 声源定位
+ 去混响
+ 声源信号提取(分离)

麦克风阵列最后将两个或多个麦克风的信号耦合到一个信号，即在多个麦克风的正前方形成一个接收区域，来削减麦克风侧向的收音效果，最大限度的将环境背景声音过滤掉，抑制噪声，并增强正前方传来的声音，从而保留语音信号。

#### 1.3 声音的采样

声音的采样过程是把模拟信号转换为离散信号。采样的标准是能够重现声音，与原始语音尽量保持一致。采样率表示每秒采样的点数，单位是赫兹，如下图：

<div align=center>
    <img src="zh-cn/img/ch28/p6.png"   /> 
</div>

声音的采样需要满足采样定理：当采样率大于信号最高频率的两倍时，采样数字信号能够完整保留原始信号中的信息。该采样定理又被称为奈奎斯特定理。如果采样率($F_{samp}$)低于限号最高频率的2倍($2f_{max}$),则采样信号会产生折叠失真：

<div align=center>
    <img src="zh-cn/img/ch28/p7.png"   /> 
</div>

人耳能听到的频率是20Hz-20kHz,发声的基音频率在70Hz-450Hz,而经过口腔鼻腔产生的谐波（周期性信号）频率一般在4khz以内，但也有部分在4kHz-8kHz。

一般来说，电话与嵌入式设备的存储空间或带宽有限，采样率较低，为8kHz;手机与PC机的采样率为16kHz,是现在的主流采样率；而CD的采样率则达到无损的程度，为44.1kHz。采样率越高，采集的间隔就越短，对应的音频损失就越小。

#### 1.4 声音的量化

声音被采样后，模拟的电压信号变成离散的采样值。声音的量化过程是指将每个采样值在幅度上再进行离散化处理，变成整形数值。如下表所示，电压范围在0.5-0.7V的采样点被量化为十进制数3，用两位2进制数编码11,...,总共4个量化值，只用两位的二进制数表示，取值范围为$0\~2^2-1$

<div align=center>
    <img src="zh-cn/img/ch28/p8.png"   /> 
</div>

下图，右边是量化后的波形，可以看出和左边原始波形差异很大。量化位数代表每次取样的信息量，量化会引入失真，并且这种失真不可逆，量化的位数可以是4位，8位，16位，32位，量化位数越高，失真越少，但占用的存储空间越多，一般采用16位量化。

<div align=center>
    <img src="zh-cn/img/ch28/p9.png"   /> 
</div>

量化方法分为均匀量化和非均匀量化，其中均匀量化采用相等的量化间隔，而非均匀量化针对大的输入信号采用大的量化间隔，小的输入信号采用小的量化间隔。这样可以在精度损失不大的情况下用较小的位数来表示信号，以减少存储空间。

<div align=center>
    <img src="zh-cn/img/ch28/p10.png"   /> 
</div>

将声音的采样率和量化位数相乘得到比特率（bps），其代表了每个音频样本每秒量化的比特位数。比如一段音频的采样率是16kHz,量化位数是16位，那么该音频的比特率是`16x16=256bps/s`。

#### 1.5 语音的编码

语音编码最早用于通信领域，1975年1月美国实现了使用LPC声码器的分组语音电话会议；1988年美国公布了一个4.8kb/s的码激励线性预测编码(CELP)语音编码标准算法；进入20世纪90年代后，随着互联网的兴起和语音编码技术的发展，IP分组语音通信技术或得了突破性的进展，如在网络游戏中，语音聊天采用IP电话技术。20世纪90年代中期还出现了很多被广泛使用的语音编码国际标准，如数码率为5.3/6.4kb/s的G.723.1等。

在语音存储过程中也需要编码，常用的音频编码格式包括PCM,MP3,A-law等

+ PCM编码：PCM(Pulse Code Modulation 脉冲编码调制)是对模拟信号进行采样，量化，编码的过程。他只保存编码后的数据，并不保存任何格式信息。PCM编码的最大优点是音质好，最大缺点是占用存储空间多。

PCM编码是PC麦克风常用的编码格式（宽带录音，16kHz,16bits)。可保存为PCM raw data(.raw文件，无头部)或Microsoft PCM格式（.wav文件）

还有一种编码格式是自使用差分PCM(ADPCM),其利用样本和样本之间高度相关性，通过已知数据预测下一个数据，然后计算出预测值和实际值之间的差值，再根据不同差值调整比例因子，进行自适应编码，达到较高的压缩比。ADPCM编码被保存为Microsoft ADPCM格式（.wav文件）

+ MP3编码

MP3编码对音频信号采用的是有损压缩格式，压缩比高达10:1~12:1。MP3编码模拟人耳听觉机制，采取“感知编码技术”，使压缩后的文件回放时能达到比较接近原始音频数据的声音效果。

+ A律编码

A律编码是ITU-T（国际电信联盟电信标准局）定义的关于脉冲编码的一种压缩/解压缩算法。是固话录音常用的格式（窄带录音8kHz,8bits)。欧洲和中国大陆等地区采用A律压缩算法，北美和日本则采用$\mu$律算法进行脉冲编码。

其他的常见编码还包括：

+ AMR(Adaptive Multi-Rate):每秒钟的AMR音频大小可以控制在1KB左右，常用于彩信，微信语音，但是失真比较厉害
+ WMA(Windows Media Audio):为抗衡MP3，微软推出了一种新的音频格式，在压缩比和音质上超过了MP3
+ AAC(Advanced Audio Coding): 相比于MP3,ACC格式的音质更佳，文件更小
+ M4A：MPEG-4音频标准的文件扩展名，最常用的.m4a文件使用AAC格式
+ FLAC(Free Lossless Audio Codec,自由音频压缩编码)：2012年以来被很多软硬件支持，其特点是无损压缩，不会破坏任何音频信息
+ Speex:Speex是一种音频编解码的库，他的比特率和压缩率的变化范围较广，常用于网络状况复杂多变的移动终端应用。

基于PCM变得WAV格式常作为不同编码互相转化的一种介质格式，以便于后续处理

<div align=center>
    <img src="zh-cn/img/ch28/p11.png"   /> 
</div>

比如我们把A律格式（8kHz,8bits)的音频文件转换为PCM WAV格式（8kHz,16bits)。要实现更多音频格式的转换，可使用FFmpeg工具。FFmpeg是一个强大的处理音视频的开源库，可实现不同批量数据的快速转换，包括转成指定采样率的WAV格式。

最后介绍两个音频处理的工具：

+ CoolEdit:可以方便的对音频文件进行剪辑和转换，如删除中间部分音频或将采样率从16kHz降到8kHz
+ Praat: 其在语音标注领域应用非常广泛，可用来同时显示原始语音的时域图和语谱图，并进行局部分析
+ Audacity:一款好用的音频编辑工具


### 2.语音特征提取

<!-- https://zhuanlan.zhihu.com/p/104079068 -->

原始语音是不定长的时序信号，不适合直接作为传统机器学习算法的输入，一般需要转换成特定的特征向量表示，这个过程称为语音特征提取。虽然随着深度神经网络技术的发展，原始的语音信号也可直接作为网络输入，但是因为其在时域上具有较大的冗余度，对深度神经网络的资源提出了较高的要求，因此语音特征提取仍是语音信号处理技术的关键环节之一。

#### 2.1 预处理

首先对原始语音时域信号进行预处理，主要包括预加重，分帧，加窗。

1. 预加重

语音经发声者的口唇辐射发出，受到唇端辐射抑制，高频能量明显降低。一般而言，当语音信号的频率提高两倍时，其功率谱的幅度下降约6dB,即语音信号的高频部分受到的抑制影响较大。在进行语音信号的分析和处理时，可采用预加重的方式补偿语音信号高频部分的振幅。假设输入信号的第$n$个采样点为$x[n]$,则预加重的公式如下：

$$x^{'}[n]=x[n]-a x[n-1]$$

其中$a$为预加重的系数，可以取1或者比1小的数值，一般为$a=0.97$.

2. 分帧

从整体上观察，语音信号是一个非平稳的信号，但考虑到发浊音时声带有规律的振动，即基音频率在短时范围内是相对固定的，因此可以认为语音信号具有短时平稳性，一般认为$10ms-30ms$的语音信号片段是一个准稳态过程。短时分析主要采用分帧方式，一般每帧帧长为20ms或25ms。则一帧有$16000 \times 0.025=400$个采样点，如下图所示：

<div align=center>
    <img src="zh-cn/img/ch28/p12.png"   /> 
</div>

相邻两帧之间的基音可能发生变化，如正好有两个音节之间或者声母向韵母过度等。为确保声学特征参数的平稳性，一般采用重叠取帧的方式，即相邻帧之间存在重叠部分（帧移一般是10ms,重叠$50\%-60\%$),如下图所示：

<div align=center>
    <img src="zh-cn/img/ch28/p13.png"   /> 
</div>

3. 加窗

分帧的方式相当于对语音信号进行了加矩形窗的处理，如下图（a）所示，矩形窗在时域上对信号进行有限截断，对应频域的通带较窄，边界处存在多个旁瓣，发生严重的频谱泄露。

<div align=center>
    <img src="zh-cn/img/ch28/p14.png"   /> 
</div>

为了减少频谱泄露，通常对每帧的信号进行其他形式的加窗处理。常用的窗函数有：汉明窗（Hamming),汉宁窗（Hanning),布莱克曼窗(Blackman)等。

考虑语音信号的短时平稳性，对每帧语音信号进行加窗处理，得到短时加窗的语音信号$x_l[n]$,如下所示：

$$x_l[n]=w[n]x[n+lL]$$

其中，$0<=n<=N-1$,$w[n]$是窗函数，$N$是窗长，$l$是帧索引，$L$是帧移。

#### 2.2 短时傅里叶变换

<!-- https://zhuanlan.zhihu.com/p/104079068  -->

人类语音的感知过程与听觉系统具有频谱分析功能紧密相关。因此对语音信号进行频谱分析，是认识和处理语音信号的重要方法。声音从频率上可以分为纯音和复合音。纯音只含有一种频率的声音（基音），而没有倍音。复合音是除基音外，还包含多种倍音的声音。大部分声音（包括语音）都是复合音。涉及多个频率段。

关于傅里叶变换为什么可以把时域信号转为频域信号进行分析可以参考这篇博文：[https://zhuanlan.zhihu.com/p/104079068](https://zhuanlan.zhihu.com/p/104079068)

+ 经离散傅里叶变换得到信号的频谱表示，其频谱的幅值和相位随着频率变化而变化。在语音信号处理中主要关注信号的频谱幅值，也成为振幅频谱，能量频谱用振幅频谱的平方表示。
+ 通过对频域信号进行逆傅里叶变换，可恢复时域信号。
+ 离散傅里叶变换的计算复杂度为$O(N^2)$。根据复数关系，采用快速傅里叶变换（FFT),可以简化复杂度，在$O(Nlog_2N)$的时间内计算出DFT。
+ 在实际应用中，对语音信号进行分帧加窗处理，将其分割成一帧帧的离散序列，可视为短时傅里叶变化(STFT)

#### 2.3 听觉特性

人类感知声音，受频率和声强影像。客观上，用频率表示声音的音高，频率低的声音，听起来感觉音调低，而频率高的声音，听起来感觉音调高。但是，音调和频率不成正比关系。音调的单位是mel频率，用来模拟人耳对不同频率语音的感知，1mel相当于1kHz音调感知程度的$1/1000$。

<div align=center>
    <img src="zh-cn/img/ch28/p18.png"   /> 
</div>

人类对不同频率语音有不同的感知能力：
+ 1kHz以下，与频率成线性干洗
+ 1kHz以上，与频率成对数关系

可见，人耳对低频信号比对高频信号更敏感。研究者根据一些列心理声学实验得到了类似人耳耳蜗作用的滤波器，用来模拟人耳对不同频段声音的感知能录，提出了由多个三角滤波器组成的mel频率滤波器组。每个滤波器带宽不等，线性频率小于1000Hz的部分为线性间隔，而线性频率大于1000Hz的部分为对数间隔

<div align=center>
    <img src="zh-cn/img/ch28/p19.png"   /> 
</div>

声音的响度，是反应人主观上感觉的不同频率成分的声音强弱的物理量，单位为方(phone),他可以由时变的压力(声压)P来表示，单位为帕斯卡（Pa)。对于空气中传播的声音，通常取其与对应参考压20微帕的比值的对数来衡量其压力大小，这个对数比值称为声压级（SPL).响度与声强，频率的关系可用等响度的轮廓线表示：

<div align=center>
    <img src="zh-cn/img/ch28/p16.png"   /> 
</div>

人耳对响度的感知也有一个范围。

#### 2.4 线性预测

语音信号的产生主要包括发生源（Source）和滤波器（Filter），人在发声时，肺部空气受到挤压形成气流，气流通过声门（声带)振动产生声门源激励$e[n]$。对于浊音，激励$e[n]$是以基音周期重复的单位冲激；对于清音，$e[n]$是平稳白噪声。该激励信号$e[n]$经过声道（咽喉，口腔，鼻腔等）的共振和调制，特别是口腔中舌头的灵活变化能改变声道的容积，从而改变发声，形成不同频率的声音。气流，声门可以等效为一个激励源，声道等效为一个时变滤波器，语音信号$x[n]$可以被看成激励信号$e[n]$与时变滤波器的单位取样响应$v[n]$的卷积
$$x[n]=e[n]*v[n]$$

根据语音信号的产生模型，语音信号$x[n]$可以等价为以$e[n]$为激励的一个全极点（AR模型）或者一个零极点（ARMA模型）滤波器的响应，如果用一个p阶全极点系统模拟激励产生语音的过程，设这个AR模型的传递函数为：

$$V(z)=\frac{X(z)}{E(z)}=\frac{G}{1-\sum^p_{i=1}a_iz^{-i}}=\frac{G}{A(z)}$$

其中，$p$是阶数，$G$是增益。

由此，语音信号$x[n]$和激励信号$e[n]$之间的关系如下表示：
$$x[n]=G.e[n]+\sum^p_{i=1}a_ix[n-i]$$

可见，语音信号的采样点之间有相关性，可用过去若干个语音采样点值的线性组合来预测未来采样点的值。通过使线性预测的采样点值在最小均方误差约束下逼近实际语音采样点，可以求取一组唯一的预测系数${a_i}$,简称为线性预测编码（LPC)系数。

在AR模型参数估计过程中，定义线性预测器为
$$\hat{x}[n]=\sum^p_{i=1}a_ix[n-i]$$
预测误差$\epsilon[n]$为
$$\epsilon[n]=x[n]-\hat{x}[n]=x[n]-\sum^p_{i=1}a_ix[n-i]=G.e[n]$$

定义某一帧内短时平均预测误差为
$$E\{\epsilon^2[n]\}=E\{(x[n]-\sum^p_{i=1}a_ix[n-i])^2\}$$

为使$E\{\epsilon^2[n]\}$最小，对$a_j$求偏导，并令其为0，从而计算出预测系数。

#### 2.5 倒谱分析

已知语音信号$x[n]$，要求出卷积的各个信号分量，也就是解卷积处理。除了线性预测技术外，还可以采用倒谱分析实现解卷积处理。倒谱分析，又称为同态滤波，主要采用时频变换，得到对数功率谱，再进行逆变换，分析出倒谱域的倒谱系数。

同态滤波处理过程如下：

(1)傅里叶变换。将时域的卷积信号转换为频域的乘积信号；
$$DFT(x[n])=X[z]=E[z]V[z]$$

(2)对数运算。将乘积信号转换为加性信号；

$$logX[z]=logE[z]+logV[z]=\hat{E}[z]+\hat{V}[z]=\hat{X}[z]$$

(3)傅里叶反变换。得到时域的云信号倒谱；

$$Z^{-1}(\hat{X}[z])=Z^{-1}(\hat{E}[z]+\hat{V}[z])=\hat{e}[n]+\hat{v}[z]=\hat{x}[n]$$

在实际应用中，考虑到离散余弦变换（DCT)具有最优的去相关性，能够将信号能量集中在极少数的变换系数上，特别是将大多数的自然信号（包括声音和图像）的能量都集中在离散余弦变换后的低频部分。而语音信号的频谱可以被看做由低频的包络和高频的细节调制而成。因此，一般采用DCT反变换代替傅里叶反变换，直接获取低频倒谱系数。对于包络信息也就是声道特征，可改写为：

<div align=center>
    <img src="zh-cn/img/ch28/p17.png"   /> 
</div>

其中，$X[k]$是DFT变换系数，$N$是DFT系数的个数，$M$是DCT变换的个数。

此时，$\hat{x}[n]$是复倒谱信号。可采用逆运算流程，恢复语音信号。但是由于DCT变换的不可逆性，从倒谱信号$\hat{c}[m]$不可还原出语音信号$x[n]$

#### 2.6 常用的声学特征

语音信号包含丰富的信息，如音素，音律，语种，语音内容等，说话人身份，情感等。一般基于发声机制或人儿感知机制提取得到频谱空间的向量表示，即声学特征。

常用的特征有Mel频率倒谱系数（MFCC),感知线性预测系数（PLP),滤波器组(Fbank),语谱图（Spectrogram)和常数Q倒谱系数(CQCC),对应的提取流程如下图所示：

<div align=center>
    <img src="zh-cn/img/ch28/p20.png"   /> 
</div>

其中语谱图，Fbank,MFCC和PLP都采用短时傅里叶变换，具有规律的线性分辨率。语谱图的特征可对功率谱取对数得到，而Fbank特征，需要经过模拟人耳听觉机制的Mel滤波器组，将属于每个滤波器的功率谱的幅度平方求和后再取对数得到。MFCC特征可以在Fbank的基础上做离散余弦变化得到。PLP特征的提取较为复杂，采取线性预测的方式实现语音信号的接卷积处理，得到对应的声学特征参数，其抗噪性能比较优越。基于CQT变换的倒谱系数CQCC最早是针对音乐信号处理提出的，具有几何级的分辨率。

##### 2.6.1 语谱图

语谱图通过二维尺度展示不同频段的语音信号强度随时间的变化情况。首先语音信号经短时傅里叶变换得到的频谱为对称普，取正频率轴的频谱曲线，并将每一帧的频谱值按照时间顺序拼接起来，语谱图的横坐标为时间，纵坐标为频率，用颜色深浅表示频谱值的大小。

<div align=center>
    <img src="zh-cn/img/ch28/p21.png"   /> 
</div>

##### 2.6.2 FBank

FBank的特征提取过程如下

+ 将信号进行预加重，分帧，加汉明窗，然后进行短时傅里叶变换得到其频谱
+ 求频谱平方，即能量谱，将每个滤波频带内的能量进行叠加，第$k$个滤波器输出的功率谱为$X[k]$

<div align=center>
    <img src="zh-cn/img/ch28/p22.png"   /> 
</div>

+ 将每个滤波器的输出取对数，得到相应频带的对数功率谱

$$Y_{FBank}[k]=logX[k]$$

FBank特征本质是对数功率谱，包括低频和高频信息，但是相比于语谱图特征，FBank经过了Mel滤波器组的处理，其被依据人耳听觉感知特性进行了压缩，抑制了一部分听觉无法感知的冗余信息。

##### 2.6.3 MFCC

MFCC计算过程如下：
+ 将信号进行预加重，分帧，加汉明窗，然后进行短时傅里叶变换得到其频谱
+ 求频谱平方，即能量谱，将每个滤波频带内的能量进行叠加，第$k$个滤波器输出的功率谱为$X[k]$
+ 将每个滤波器的输出取对数，得到相应频带的对数功率谱，并进行反离散余弦变换，得到$L$个MFCC系数
$$C_n=\sum^M_{k=1}logX[k]cos(\frac{\pi(k-0.5)n}{M}),n=1,2,...,L$$
+ 由上式计算得到的MFCC特征，可将其作为静态特征，在对这种静态特征做一阶和二阶差分，得到相应的动态特征

逆Mel频率倒谱系数特征（IMFCC)的提取是在传统的MFCC特征的基础上，把Mel滤波器组的排列方式进行了改造。使得Mel滤波器在低频的部分比较松散，在高频的部分较为密集（与MFCC的滤波器组镜像对称），除了滤波器组的带宽不同之外，IMFCC与MFCC的特征提取完全相同。

##### 2.6.4 PLP (* )

<!-- https://blog.csdn.net/huashui2009120/article/details/80450062 -->
<!-- https://www.cnblogs.com/wb-DarkHorse/archive/2012/10/12/2721110.html -->

LPC(Linear Predictive Coding，线性预测分析)：由于语音信号的发音特性，提取特征后的帧与帧之间是不独立的，那么我们可以用前面的帧或后面的帧预测当前帧。所求的的预测系数就是我们要用到的特征。线性预测分析中，我们可以用一个全极点滤波器为**声道响应函数建模**

<div align=center>
    <img src="zh-cn/img/ch28/p23.jpg"   /> 
</div>

即$y(z)=x(z).H(z)$.以最小化预测误差为目标优化系数$a$,就可以得到特征系数。通常采用自相关方法，利用durbin算法求解方程。这里给出参数计算公式:

1) 给定一个窗内的采样点信号${s_n,n=1,...,N}$,它的自相关序列计算公式为：

<div align=center>
    <img src="zh-cn/img/ch28/p24.jpg"   /> 
</div>

2) 滤波器还有一个反射系数${k_i}$,可以理解为声道的反射系数，和预测误差$E$，初始化为$r_0$,设${k^{(i-1)}_j}$和${a^{(i-1)}_j}$是$i-1$阶滤波器的反射系数和预测系数，关于$i$阶滤波器的反射系数和预测系数可以通过三个步骤求得：

<div align=center>
    <img src="zh-cn/img/ch28/p25.jpg"   /> 
</div>

<div align=center>
    <img src="zh-cn/img/ch28/p26.jpg"   /> 
</div>
<div align=center>
    <img src="zh-cn/img/ch28/p27.jpg"   /> 
</div>
<div align=center>
    <img src="zh-cn/img/ch28/p28.jpg"   /> 
</div>
<div align=center>
    <img src="zh-cn/img/ch28/p29.jpg"   /> 
</div>

这样就得到了$p$个预测系数，我们也可以用$p$个反射系数$k_i$当做特征.

另外，也可以求预测倒谱系数作为特征。推导如下

<div align=center>
    <img src="zh-cn/img/ch28/p30.jpg"   /> 
</div>

用倒谱系数是因为使用DCT变换，将系数去相关，那么就可以利用对角协方差矩阵去描述状态的高斯分布。倒谱特征的维数应与预测系数个数相同.

PLP(Perceptual Linear Predict ive，感知线性预测):是一种基于听觉模型的特征参数。该特征参数是全极点模型预测多项式的一组系数,等效于一种LPC( Linear Prediction Coefficient , 线性预测系数) 特征。它们的不同之处是PLP 技术将人耳听觉试验获得的一些结论, 通过近似计算的方法进行了工程化处理, 应用到频谱分析中, 将输入的语音信号经听觉模型处理后所得到的信号替代传统的LPC 分析所用的时域信号。经过这样处理后的语音频谱考虑到了人耳的听觉特点, 因而有利于抗噪语音特征提取。

PLP 技术主要在三个层次上模仿了人耳的听觉感知机理:

1) 临界频带分析处理;

2) 等响度曲线预加重;

3) 信号强度- 听觉响度变换。

PLP 特征提取步骤如图所示。

<div align=center>
    <img src="zh-cn/img/ch28/p31.jpg"   /> 
</div>

1 频谱分析

语音信号经过采样、加窗、离散傅立叶变换后,取短时语音频谱的实部和虚部的平方和, 得到短时功率谱

$$P ( f ) = Rx [ X ( f ) ]^2 + I m [ X ( f ) ]^2$$

2 临界频带分析

临界频带的划分反映了人耳听觉的掩蔽效应,是人耳听觉模型的体现。利用公式
$$Z( f ) = 6ln[ f / 600+ [ ( f / 600)2 + 1] 0.5 ]$$

将频谱$P ( f )$ 的频率轴$f$ 映射到Bark 频率$Z$, 总共得到17 个频带.这17 个频带中每个频带内的能量谱与式( 3) 的加权系数相乘, 求和后得到临界带宽听觉谱$θ( k)$ 。

<div align=center>
    <img src="zh-cn/img/ch28/p32.jpg"   /> 
</div>

其中$Z_0 ( k )$ 表示第$k$ 个临界带听觉谱的中心频率.


3 等响度预加重

用模拟人耳大约40 dB 等响曲线$E( f )$ 对$θ( k)$进行等响度曲线预加重, 即
$$Γ( k) = E[f_0(k)]θ( k) , ( k = 1, 2, ..., 17) $$
$f_ 0 ( k )$ 表示第$k$ 个临界带听觉谱的中心频率所对应的频率( 单位为Hz) 。其中
$$E[ f_0(k)] =(f_0(k)^2 + 1. 44 * 10^6 )f_0(k)^4/( f_0(k)^2 + 1.6*10^5)^2*( f_0( k)^2 + 9.61*10^9)$$

4 强度-响度转换

为了近似模拟声音的强度与人耳感受的响度间的非线性关系, 进行强度-响度转换
$$θ(k) = Γ( k )^{0.33} $$

经过离散傅里叶反变换后, 用德宾算法计算12阶全极点模型, 并求出16 阶倒谱系数, 最后的结果即为PLP 特征参数。


##### 2.6.5 CQCC(* )

<!-- https://blog.csdn.net/weixin_43335465/article/details/128943889 -->

STFT 和 CQT 可以看成是时间信号频域分析的两个同级的方法。在 STFT 中，从长的序列中提取固定长度的片段与窗函数相乘后进行 FFT，然后重复应用滑动窗口得到最终的谱图。STFT 实际上是一个滤波器组，定义 Q 因子为滤波器的中心频率和滤波器带宽之比：

$$Q=\frac{f_k}{δf}$$

​在STFT 中，每个滤波器的带宽是恒定的，当频率从低频到高频时，Q 因子增加。但是人类的感知系统的 Q 因子在 500Hz-20KHz 之间近似常数，因此，至少从感知角度来看，STFT对于语音信号的时频分析可能并不理想。

于是提出 CQT 变换，第一种算法由Youngberg和Boll于1978年提出的（Youngberg-Boll），而另一种算法则是由 Kashima 和MontReynaud-Kashima在1986年提出（Mont Reynaud）。在这些方法中，倍频程（octaves）是几何分布的，如下图：

 <div align=center>
    <img src="zh-cn/img/ch28/p33.png"   /> 
</div>

1.CQT计算

离散时域信号$x(n)$的 CQT 计算如下：

 <div align=center>
    <img src="zh-cn/img/ch28/p34.png"   /> 
</div>
​
其中$k=1,2,...,K$为频率索引，$a^{*}_k(n)$为$a_k(n)$的复共轭，$N_k$为可变的窗口大小，其中$a_k(n)$的定义如下：

 <div align=center>
    <img src="zh-cn/img/ch28/p35.png"   /> 
</div>

其中，$f_k$是第$k$个频带的中心频率，$f_s$是采样率，$w(t)$为窗函数，$Φ_k$为相位偏执，缩放因子$C$由下式给出：

 <div align=center>
    <img src="zh-cn/img/ch28/p36.png"   /> 
</div>

为了满足恒Q变换，中心频率必须满足：

$$f_k=f_12^{\frac{k-1}{B}}$$
这里的$f_1$是由最低频率带的中心频率，$B$确定每个倍频程的频带数。

 <div align=center>
    <img src="zh-cn/img/ch28/p37.png"   /> 
</div>

则 Q 因子计算如下：

 <div align=center>
    <img src="zh-cn/img/ch28/p38.png"   /> 
</div>

同时窗函数长度 $N_k$满足：
$$N_k=\frac{f_s}{f_k}Q$$ 


2.CQCC 提取

首先 MFCC 计算如下：

 <div align=center>
    <img src="zh-cn/img/ch28/p39.png"   /> 
</div>

其中，Mel 谱计算如下：

 <div align=center>
    <img src="zh-cn/img/ch28/p40.png"   /> 
</div>

其中，$k$ 是DFT之后的频率索引系数，$H_m(k)$是第 $m$个Mel 尺度下的三角加权函数带通滤波器。这里，$M$ 代表滤波器的个数（$MF(m)$ 为 $M$点的序列），$q$代表离散余弦变换的点数。

倒谱分析不能直接被用于 CQT，因为$X^{C Q}(k)$ 和 DCT 的余弦函数的尺度不同（一个是几何一个是线性）。可以通过将几何空间转换为线性空间来解决这个问题。

由于在 $X^{C Q}(k$中，$k$个频带几何分布，信号重构的过程可以看成是前 $k$个频带（低频部分）进行下采样，后 $K−k$个频带（高频部分）进行上采样得到的，将第 $k$个频带的中心频率 $f_k$和 第一个频带的中心频率 $f_1=f_{min}$的频率差记为：

 <div align=center>
    <img src="zh-cn/img/ch28/p41.png"   /> 
</div>

其中，$k = 1,2,\cdots, K$ 为频率索引，距离$\Delta f^{k \leftrightarrow 1}$为$k$的递增函数。我们以周期 $T_l$进行重采样，这等效于确定一个关于$k_l$的函数使得：

 <div align=center>
    <img src="zh-cn/img/ch28/p42.png"   /> 
</div>

以下关注第一个倍频程，通过将第一个倍频程以周期$T_l$进行 $d$等分，解得$k_l$为

 <div align=center>
    <img src="zh-cn/img/ch28/p43.png"   /> 
</div>

新的频率计算为：

 <div align=center>
    <img src="zh-cn/img/ch28/p44.png"   /> 
</div>

因此，在第一个倍频程中有$d$个均匀采样，第二个倍频程中有 $2d$ 个，第 $j-1$个倍频程中有 $2^jd$个。

信号重构方法采用了多相抗混叠滤波器和样条插值方法，以均匀的采样率$F_lF$对信号进行重新采样。

最后，CQCC 系数计算如下：

 <div align=center>
    <img src="zh-cn/img/ch28/p45.png"   /> 
</div>

其中，$p=0,1,\cdots,L-1$ 是重采样之后得频带索引.

 <div align=center>
    <img src="zh-cn/img/ch28/p46.png"   /> 
</div>

综上所述，通过不同特征提取方法得到的声学特征所表示的语音特点是不同的，FBank保留更多的原始特征，MFCC去相关性较好，而PLP抗噪性更强。

### 3.再谈GMM-HMM

<!-- https://zhuanlan.zhihu.com/p/258826836 -->
**单音素模型**

在GMM-HMM中以音素为单位进行建模。对连续语音提取MFCC特征，将特征对应到**状态**这个最小单位，通过状态获得音素，音素再组合成单词，单词串起来变成句子。

<div align=center>
    <img src="zh-cn/img/ch28/p47.png"   /> 
</div>

其中，若干帧对应一个状态，三个状态组成一个音素（状态比音素更小），若干音素组成一个单词，若干单词连成一个句子。难点并在于若干帧到底是多少帧对应一个状态了，这就使用到了viterbi对齐。
为了提高识别率，在三音子GMM-HMM模型基础上，又用DNN模型取代GMM模型，达到了识别率明显的提升。

<div align=center>
    <img src="zh-cn/img/ch28/p48.jpg"   /> 
</div>

将特征用混合高斯模型进行模拟，把均值和方差输入到HMM的模型里。**GMM描述了状态的发射概率**(HMM的每个状态产生每一帧特征的观测值的概率），HMM重每个状态对应一个GMM，拟合状态的输出分布。

单音素模型虽然可以完成基本的大词汇量连续语音识别的任务，但是存在一定缺点。

+ 建模单元数目少，一般英文系统的音素数量在30～60个，中文系统音素数目在100个左右。这么少的建模单元难以做到精细化的建模，所以识别率不高。
+ 音素发音受其所在上下文的影响，同样的音素，在不同的上下文环境中，数据特征也有明显的区分性。

所以就考虑音素所在的上下文(context)进行建模，一般的，考虑当前音素的前一个（左边）音素和后一个（右边）音素，称之为三音素，并表示为A-B+C的形式，其中B表示当前音素，A表示B的前一个音素，C表示B的后一个音素。

单音素模型的训练：

一段2秒的音频信号，经过【分帧-预加重-加窗-FFT-Mel滤波器组-DCT】，得到MFCC特征作为输入信号，此处若以帧长为25ms，帧移为25ms为例，可以得到80帧的输入信号，这80帧特征序列就是观察序列：

$$O=[o_1,...,o_T],T=80$$

给定观察序列$O$，估计GMM-HMM模型的参数，这就是训练问题。

+ 输入：$O=[o_1,...,o_T],T=80$,即80帧的MFCC特征
+ 目标：估计GMM-HMM的参数，$\lambda=(A,B)$,使得$P(O|\lambda)$最大
+ 输出：通过模型计算每一帧属于“S IH K S”这四个音素中某一个状态（3状态）的概率

A是转移概率，B是观察概率，也就是发射概率。我们使用GMM模型对观察概率建模，所以实际参数就是高斯分布中的均值和方差。模型参数就是转移概率、高斯分布的均值、方差（单高斯的情况）。单音素GMM-HMM模型的训练是无监督训练。

!> 灵魂的拷问：我们对语音进行了标注，也就是给了输入语音的label，为什么这个训练还是无监督的呢？

模型的训练并不是直接输入语音，给出这个语音是什么，然后和标注label求loss。模型的训练是输入特征到音素的状态的训练，即我们并不知道哪一帧输入特征对应哪个音素的哪一个状态。训练的目的就是找到帧对应状态的情况，并更新状态的GMM参数。把每一帧都归到某个状态上，本质上是进行聚类，是无监督训练。

单音素GMM-HMM模型的训练通过Viterbi训练(嵌入式训练)，把“S IH K S”对应的GMM模型嵌入到整段音频中去训练。

训练步骤如下图：

<div align=center>
    <img src="zh-cn/img/ch28/p50.png"   /> 
</div>

1.初始化对齐，为什么要初始化对齐？

目的为viterbi提供初始参数A、B。一开始不知道一段语音的哪些帧对应哪些状态，我们就进行平均分配。比如两秒的“ six”语音一共80帧，分成四个因素“S IH K S”，每个音素分配到20帧，每个音素又有三个状态组成，每个状态分配6或者7帧。这样就初始化了每个状态对应的输入数据。

就是假设前0-20帧数据都是“S”这个音素的发音，20-40帧数据都是“IH”这个音素的发音，40-60帧是“K”这个音素的发音，60-80是“S”这个音素的发音。但这只是一个假设，事实到底如此我们还不知道。我们可以在这个初始对齐下进一步优化。

<div align=center>
    <img src="zh-cn/img/ch28/p51.png"   /> 
</div>

2.初始化模型

HMM模型$λ=(A,B,Π)$。我们对初始对齐的模型进行count。count什么呢？在初始化对齐后就可以count`状态1->状态1`的次数，`状态1->状态2的次数`，这就是转移次数，`转移次数/总转移次数=转移概率`。转移初始转移概率$A(a_{ij})$就得出了。

Π就是`[1,0,0,0...]`，一开始在状态一的概率是100%。在语音识别应用中由于HMM是从左到右的模型，第一个必然是状态1，即$P(q_0=1)=1$。所以没有$p_i$这个参数了。

还有$B(b_j(o_t))$参数怎么办？

一个状态对应一个GMM模型，一个状态对应若干帧数据，也就是若干帧数据对应一个GMM模型。一开始我们不知道哪些帧对应哪个状态，所以GMM模型的输入数据就无从得知。现在初始化后，`状态1`对应前6帧数据，我们就拿这六帧数据来计算状态1的GMM模型（单高斯，只有一个分量的GMM），得到初始均值和方差 。

完美的假想：假设我们初始化分配帧恰恰就是真实的样子，那么我们的gmm参数也是真实的样子，这个模型就已经训练好了。

3.重新对齐（viterbi硬对齐，Baum-welch软对齐）

假想想想就好了，现在得到的GMM-HMM模型就是个胚芽，还有待成长，懂事，这就需要重新对齐，向真实情况逼近的重新对齐。如何逼近真实情况？viterbi算法根据初始化模型λ=(A,B,Π)来计算。它记录每个时刻的每个可能状态的之前最优路径概率，同时记录最优路径的前一个状态，不断向后迭代，找出最后一个时间点的最大概率值对应的状态，如何向前回溯，得到最优路径。得到最优路径就得到最优的状态转移情况，哪些帧对应哪些状态就变了。转移概率A就变了。

哪些帧对应哪些状态变了导致状态对应的GMM参数自然就变了，也可以跟着更新均值和方差，即发射概率B变了。

<div align=center>
    <img src="zh-cn/img/ch28/p52.jpg"   /> 
</div>

4.迭代

新的A和新的B又可以进行下一次的Viterbi算法，寻找新的最优路径，得到新的对齐，新的对齐继续改变着参数A、B。如此循环迭代直到收敛，则GMM-HMM模型训练完成。

迭代何时是个头？

一般是设置固定轮数，也可以看一下对齐之后似然的变化，如果变化不大了，基本就是收敛了。


**三音素模型**

<div align=center>
    <img src="zh-cn/img/ch28/p49.png"   /> 
</div>

考虑音素所在的上下文(context)进行建模，一般的，考虑当前音素的前一个（左边）音素和后一个（右边）音素，称之为三音素，并表示为A-B+C的形式，其中B表示当前音素，A表示B的前一个音素，C表示B的后一个音素。

使用三音素建模之后，引入了新的问题：

+ N个音素，则共有$N^3$ 个三音素，若$N=100$，则建模单元又太多了，每个音素有三个状态，每个状态对应的GMM参数，参数就太多了。
+ 数据稀疏问题，有的三音素数据量很少
+ unseen data问题。有的三音素在训练数据没有出现，如`K-K+K`，但识别时却有可能出现，这时如何描述未被训练的三音素及其概率。

所以通常我们会根据数据特征对triphone的状态进行绑定，常见的状态绑定方法有**数据驱动聚类**和**决策树聚类**，现在基本上是使用决策树聚类的方式。

三音素GMM-HMM模型是在单音素GMM-HMM模型的基础上训练的。为什么要先进行单音素GMM-HMM训练？

通过在单音素GMM-HMM模型上viterbi算法得到与输入对应的最佳状态链，就是得到对齐的结果。对每个音素的每个state建立一颗属于他们自己的决策树，从而达到状态绑定的目的。

<div align=center>
    <img src="zh-cn/img/ch28/p53.jpg"   /> 
</div>

+ 从根节点经过一系列的问题，相近（相似度高）的（绑定）三音素到达同一个叶子节点。
+ 决策树建立的基本单元是状态，对每个三音子的每个state建立一颗属于他们自己的决策树。
+ 每个三音素对于该问题都会有一个Yes或No的的答案，那么对所有的三音素来讲，该问题会把所有三音素分成Yes集合和No集合。
+ 根节点是说这是以zh为中心音素的三音素的第三个状态的决策树，第一个状态和第二个状态也都有各自独立的决策树
即使zh-zh+zh从未在训练语料中出现过，通过决策树，我们最终将它绑定到一个与之相近的叶子节点上。

通过单音素系统，我们可以得到单音素各个状态所有对应的特征集合，做一下上下文的扩展，我们可以得到三音素的各个状态所有对应特征集合。通过这样的方法，我们可以把训练数据上所有的单音素的数据对齐转为三音素的对齐。

决策树的生成流程：
+ 初始条件（单音素系统对齐，一个根节点）
+ 选择当前所有待分裂的节点、计算所有问题的似然增益，选择使似然增益最大的节点和问题对该节点进行分裂。
+ 直至算法满足一定条件终止。

从单音素GMM-HMM到三音子GMM-HMM的过程就是发现问题，解决当前问题又引入了新问题，再解决新问题的过程。
单音素建模单元少，难以做到精细化建模，识别率不高，单音素发音受上下文影响。
为了优化或者说解决这些问题，引进三音子模型，导致建模单元又太多，所谓过犹不及。同时还出现数据稀疏问题，unseen data问题。
为了解决这些问题，引入带决策树的GMM-HMM模型，解决了上面问题。
为了提高识别率，在三音子GMM-HMM模型基础上，又用DNN模型取代GMM模型，达到了识别率明显的提升。

语音识别从最初的动态时间规整（DTW)到使用GMM-HMM再到应用各种神经网络的DNN-HMM,已经有了长足的发展。但是GMM-HMM没有利用到帧的上下文信息。不能充分描述声学特征的状态空间分布。而DNN-HMM需要私用GMM-HMM的结果，对帧与状态进行对齐，这两种方法都有其局限性。同时HMM基于bayes理论需要声学模型，语言模型，发音词典三大组件，需要分开设计每个组件，且不同模型要分开训练，然后通过WSFT等解码器再融合再一起，步骤甚为繁琐。由于每个组件的训练，设计都需要专业知识和技术积累，一部分没调好就会导致整体效果欠佳，因此传统的ASR算法入门难，维护难，迫切需要简介的框架。

自2015年以来，端到端的模型开始应用于ASR领域，日益成为研究热点。E2E的ASR模型只需要输入端的语音特征和输出端的文本信息。传统的3大组件被融合为一个网络模型。直接实现输入语音到输出文本的转换。

由于没有词典也没有分词，E2E的ASR模型一般以字符（中文用字，英文用字母）作为建模单元。其模型主要分为胡太医CTC和Attention的模型。

2006年，Graves等人在ICML 2006上首次提出CTC方法，该方法直接对其输出标签和输入序列，不再像DNN-HMM那样需要对其标注。CTC假定输入符号是相互独立的，输出序列与输入序列按时间顺序单调对齐。然后通过动态规划来解决序列对齐问题。对于一段语音，CTC最后的输出是尖峰（spike)的序列，而不关心每一个字符对应的时间长度。

2012年，Graves等人又提出了RNN-T,他是CTC的一个扩展，能够整合输入序列与之前的输出序列，这相当于同时对声学模型和语言模型进行优化。

2014年，基于Attention的Encoder-Decoder方案在机器翻译中得到了广泛的应用，Chorowski等人2015年将Attention用于ASR领域，大放异彩。近几年来，基于Attention的语音识别模型（特别是Transformer)在学术界引起极大的关注，相关的研究取得了极大进展。这种模型无需对输入输出序列的对齐做任何预先假设，而是可以同时学习编码，解码和如何对齐。


### 4.说话人识别 i-vector, x-vector

说话人识别的目的是给出一段语音，指出这段语音的说话人来源以识别说话人，或者判断一段语音是否属于某个特定的说话人。说话人识别可以在很多场合应用。比如智能电视通过辨别用户是家长还是孩子来推荐适当的节目，或者和语音识别，语音唤醒等技术结合使用，滤除无关说话人的声音，只允许特定用户唤醒设备等。

在前深度学习时代，说话人识别经历了GMM-UBM，JFA,i-vector,i-vector+PLDA几个主要技术发展阶段，这些技术阶段都可以划分为传统的技术阶段。现在深度学习技术的说话认识别成为主流，大多学者认为深度学习是说话人识别的未来方向，但是传统的说话人识别技术仍具有很多优势，他对训练数据标注要求低，资源占用少，目前传统方法和基于深度学习的方法都有广泛应用。

有的说话人技术只能对特定的文本有效，被称为文本相关的说话人识别技术，有的说话人识别技术则对任何文本内容都有效，被称为文本无关的说话人识别技术。对于文本相关的说话人识别技术来说，一种常见的方法是使用来自特定说话人自适应的语音识别模型对文本进行强制对齐，把对其似然值高的模型的自适应来源说话人作为说话人识别结果，这种该方法在实践中较为有效，但由于其文本相关的局限性，应用范围很有限。Kaldi中的说话人识别案例均是文本无关的。

早期主流的说话人识别是朴素基于GMM或GMM-UBM的，朴素基于GMM的说话人识别，其思路和上文提到的文本相关说话人识别的思路比较类似，即对每个说话人收集较多的声学特征，分别训练GMM模型。在识别时用各个说话人的GMM模型计算待测音频的似然，似然值高的模型的来源说话人作为识别结果。这种方法需要手机大量的目标说话人数据，但在实际中目标说话人大多只有少数的几句语音。因此学者对其进行了改进，并不是对每个说话人分别训练GMM模型，而是很多说话人语音放在一起训练一个GMM模型，被称为通用背景模型（UBM).用每个目标说话人数据对UBM模型做自适应，自适应的方法通常用最大后验概率（MAP)方法，自适应后就相当于得到了每日个人说话人的GMM模型，然后比较待测语音的似然值即可。

2005年，Kenny提出了联合因子分析（JFA)方法，该方法把GMM均值向量表示的超向量空间进行分解，在其中的说话人和信道空间中用坐标区分说人话人，后来该方法被进一步简化为i-vector方法。JFA和i-vector方法把高位说话人特征用低维表示，性能比UBM-GMM方法的性能有显著的提升，迅速成为主流的说话人识别方法。

接下来将重点介绍i-vector及借用自人脸识别和i-vector配合使用的PLDA,之后我们以Kaldi中实现的x-vector为例子，介绍一种基于深度学习的说话人能识别。

#### 4.1 基于i-vector和PLDA的说话人识别技术

##### 4.1.1 整体流程

本节介绍一种传统说话人识别框架：基于i-vector和PLDA的说话人识别。Kaldi的src08示例完整的演示了该框架的流程。

src08是Kaldi针对美国国家标准与技术研究院在2008年举办的说话人识别比赛任务的解决方案，该比赛从1996年开始举办，从2006年起没两年举办一次，最近的一次是2018年。本节以这个示例为主线，介绍使用i-vector+PLDA框架进行说话人识别的流程。

和其他示例一样，sre08的进入也是run.sh。这个脚本由如下几个主要部分构成。

+ 下载数据。训练数据合并了很多数据集，如Fisher,2004-2008年的sre训练集等。
+ 提取声学特征。这里提取20维的MFCC
+ "语音/非语音"检测。由于静音会对说话人识别造成干扰，因此需要把静音滤出
+ 用数据训练i-vector提取器。
+ 提取i-vector
+ 根据提取的i-vector做说话人识别。脚本里演示了多种方法，效果最好的PLDA

```shell
## 下载数据
local/make_fisher.sh ...
utils/combine_data.sh ...

## 提取声学特征
steps/make_mfcc.sh ...

## 静音检测
sid/compute_vad_decision.sh ...

## 用训练数据训练i-vector提取器
sid/train_diag_ubm.sh ...
sid/train_ivetcor_extractor.sh ...

## 提取i-vector
sid/extract_ivectors.sh ...

## 根据提取的i-vector进行说话人识别
ivector-compute-plda ...
ivector-plda-scoring ...
local/score_sre08.sh ...

```

##### 4.1.2 i-vector的提取

i-vector由Kenny等学者提出，由Joint Factor Analysis简化而来，表征了说话人相关的重要的信息。下面介绍i-vector的提取方法。

首先用包含很多说话人的声学特征训练GMM模型，称为通用背景模型（UBM）

```
## 首先训练一个对角协方差矩阵的UBM
sid/train_diag_ubm.sh --nj 30 --cmd "$train_cmd" data/train_4k 2048 exp/diag_ubm_2048

## 使用已训练的对角协方差矩阵作为迭代的起点，训练非对角协方差阵的UBM

## 协方差阵将在求逆后用于i-vector提取器的训练集i-vector的提取
sid/train_full_ubm.sh --nj 30 --cmd "$train_cmd" data/train_8k exp/diag_ubm_2048 exp/full_ubm_2048
```

把UBM的个高斯分量的均值拼接起来，就构成了一个超向量记做$\bar{\mu}$.对于某特定的说话人，如果其声学特征的概率分布也可以用GMM建模。那么拼接该GMM的高斯分量均值，就得到该说话人的超向量，记做$\mu$.我们假设$\mu$和$\bar{\mu}$存在下面的关系
$$\mu=\bar{\mu}+Tw$$

在上式中$T$是一个矩阵，向量$w$可以认为是矩阵$T$的列向量张成的空间的坐标，我们可以用该坐标表示说话人信息，向量$w$即是我们所说的i-vector.

由于$w$未知，$T$的训练是一个含有隐含变量的最大似然估计问题。因此需要使用EM算法。其中E步计算训练集下的$w$的条件概率$p(w|x)$,M步更新$T$来最大化$p(w|x)$,E步和M步反复迭代训练得到$T$.

EM训练的具体公式这里不做具体介绍，但读者需要了解的是，要计算$p(w|x)$需要计算如下统计量：

+ 零阶统计量：$N_c(\mu)=\sum^T_{t=1}\gamma_t(c)$,其中$\gamma_t(c)$为给定观测向量$x_t$下高斯分量$c$的后验概率$P(c|x_t)$
+ 一阶统计量：$F_c(\mu)=\sum^T_{t=1}\gamma_t(c)x_t$,在kaldi中，把提取i-vector需要用到的参数集合称为i-vector提取器，其中矩阵$T$是i-vector提取器最重要的组成部分。训练i-vector提取器的脚本在egs/sre08/v1/sid/train_ivector_extractor.sh中。这个脚本需要用到一个已经训练好的非对角协方差阵的UBM-GMM，里边的主要的操作是：ivector-extractor-sum-accs(计算各统计量)和ivector-extractor-est(使用计算的统计量，应用EM算法更新矩阵T等提取器参数)

要计算$w$，读者可能想到对矩阵$T$求逆，通常$T$非方阵，且说话人相关的超向量$\mu$也不容易估计。实际上，要获取$w$的值，可以使用上文提到的训练$T$的EM算法中的E步，用各阶统计量直接求取给定序列$x$下的$p(w|x)$的均值作为$w$的估计.Kaldi的ivector-extract就是用于这个计算的。

提取i-vector的脚本实例在egs/sre08/v1/sid/extract_ivector.sh中，里面的核心工具是ivector-extract.为了减少计算量，该脚本使用gmm-gselect工具把后验概率低的高斯分量滤出。在i-vector提取完毕后，该脚本的stage2部分对i-vector做了长度规整。

##### 4.1.3 基于余弦距离对i-vector分类

先对i-vector使用线性判别分析(LDA)降维，再计算余弦距离。LDA是一种常用的有监督的线性变换方法。其思想是通过线性变换使得类间距离最大化，同时使类内距离最小化。Kaldi对i-vector的LDA的实现在ivector-compute-lda工具中。经过LDA后等错率为6.2%，而没有LDA的 等错率为11.10%。

##### 4.1.4 基于PLDA对i-vector分类

Probabilistic Linear Discriminant Analysis(PLDA)最初是在人脸识别任务中提出的。被验证效果良好。说话人识别和人脸识别同属于生物信息识别范畴，借鉴人脸识别算法是自然而然的。

Kaldi的PLDA的核心思想是把样本映射到一个隐空间。考虑样本$x$的分布由协方差阵正定的一个GMM定义，如果已知$x$属于某个高斯分量，且该高斯分量的均值点为$y$,那么有
$$P(x|y)=N(x|y,\Phi_w)$$

上式中的$\Phi_w$是正定的协方差阵，$y$的先验概率同样满足高斯分布；
$$P(y)=N(y|m,\Phi_b)$$

用这种方式表示的$x$如下图所示：

<div align=center>
    <img src="zh-cn/img/ch28/p54.png"   /> 
</div>

假定$\Phi_w$正定，$\Phi_b$半正定，那么我们可以找到一个非奇异的矩阵$V$,使得：
$$V^T\Phi_bV=\Psi$$
$$V^T\Phi_wV=I$$

上式中的$\Psi$为对角阵，$I$为单位阵。

如果定义$A=V^{-T}$,那么：
$$\Phi_b=A\Psi A^T$$
$$\Phi_w=AA^T$$

把$\Phi_b,\Phi_w$对角化后，我们可以把$x$映射为一个隐变量，在这个隐变量中$\mu$表示样本，通过仿射变换$x=m+A\mu$与$x$建立联系。在这个隐空间中$\mu$满足如下高斯分布：
$$\mu \sim N(.|v,I)$$

$v$作为隐空间的类别，满足：

$$v \sim N(.|0,\Psi)$$

这样就可以用隐空间中的$\mu$表示样本，如下图所示：

<div align=center>
    <img src="zh-cn/img/ch28/p55.png"   /> 
</div>

在隐空间中可以预测样本$x$的类别。与常见的分类模型不同的是，即使训练数据中从未出现过某类别，仍然可以通过计算样本是否和该样本属于同一类别而将样本分为此类。考虑到$M$个类别的参样本$(x^1,...,x^M)$,现在有一个待测样本$x^p$,要预测属于$1\sim M$的哪个类别。

我们首先按照映射关系$x=m+A\mu$把所有的$(x^1,...,x^M)$和$x^p$映射到隐空间：
$$\mu=A^{-1}(x-m)$$
对$(\mu^1,...,\mu^M)$中的每一个$\mu^g$，可计算该样本和$\mu^p$属于同一类的概率：
$$P(\mu^p|\mu^g)=N(\mu^p|\frac{\Psi}{\Psi+I}\mu^g,I+\frac{\Psi}{\Psi+I})$$

如果$M$类参考样本中每个类有$n$个样本，在上式中取$\mu^g$的平均值$\bar{\mu}^g$,即可：
$$P(\mu^p|\mu^g_{1,...,n})=N(\mu^p|\frac{n\Psi}{n\Psi+I}\bar{\mu}^g,I+\frac{n\Psi}{n\Psi+I})$$

选取使$P(\mu^p|\mu^g_{1,...,n})$最大的$\mu^g_{1,...,n}$，就得到对$\mu^p$的分类结果。

现在我们已经了解如何使用PLDA进行向量分类。

又上文可知，一个PLDA包含下列待训练参数：
+ 均值向量$m$
+ 协方差阵$\Psi$
+ 线性变换$A$

可以使用EM算法训练这些参数，PLDA的训练 在Kaldi中的ivector-compute-plda工具中有实现。使用PLDA等错率由LDA和余弦相似度的6.2%降低到了4.68%。

i-vector和PLDA从出现起就迅速取代了UBM-GMM方法。一直都是说话人识别的主流技术，虽然最近i-vector正逐渐被深度学习技术取代，但i-vector的训练无需对说话人识别的目标的目标打标签，属于无监督训练 ，这是一个重要的优势。即使在今天i-vector+PLDA的组合依然广泛应用于各种说话人识别算法中。另外i-vector包含说话人和信道特征，如果把i-vector和声学特征放在一起作为神经网络的输入，则在实践中能够有效的提升语音识别率。

#### 4.2 基于深度学习的说话人识别技术

##### 4.2.1 概述

前面介绍了基于i-vector的说话人识别。近年来，人民倾向于使用有监督的深度学习技术来直接解决各种问题，说话人识别也不例外。

基于深度学习的说话人识别，一种思路是使用DNN的输出状态代替GMM的混合分量来提取i-vector,可以达到比基于GMM的i-vector更好的性能。这种方法在Kaldi中的sec08实例中的sid/train_ivector_extractor_dnn.sh中实现了。该方法依然是i-vector,与上一节的介绍没有本质的区别。

另一种思路是提取嵌入向量表征说话人信息，如下图所示：

<div align=center>
    <img src="zh-cn/img/ch28/p56.png"   /> 
</div>

得到嵌入向量后，可以用其代替i-vector,然后进行PLDA等方法进行说话人识别。本节以介绍Kaldi的sec16 v2为主线，介绍基于一种嵌入向量的x-vector的说话人识别方法。

##### 4.2.2 x-vector
<!-- https://blog.csdn.net/Robin_Pi/article/details/109575815 -->
<!-- https://www.cnblogs.com/zy230530/p/13657793.html -->

基于嵌入向量的说话人识别，一种比较有影响的方法是Google公司在2014年提出的d-vector方法，该方法将声学特征序列通过一个DNN，其分类目标是说话人标签，取该神经网络的最后一个隐藏层输出的平均值，即得到说话人嵌入向量，称作d-vector.

<div align=center>
    <img src="zh-cn/img/ch28/p57.png"   /> 
</div>

如上图：DNN训练好后，提取每一帧语音的Filterbank Energy 特征作为DNN输入，从Last Hidden Layer提取Activations，L2正则化，然后将其累加起来，得到的向量就被称为d-vector。如果一个人有多条Enroll语音，那么所有这些d-vectors做平均，就是这个人的Representation


<div align=center>
    <img src="zh-cn/img/ch28/p58.png"   /> 
</div>

d-vector是14年提出的一个和i-vector效果差不多的深度学习模型（还没有i-vector好）。
它的思想很简单，在训练的时候，就是截取语音中的一小段之后，把这段放到DNN里去训练，最后输出这段话是哪个人说的。训练结束之后，倒数第二层的feature就是我们要的speaker embedding了。

在实际预测的时候，我们的输入语音是不等长的，因此d-vector会把语音截成多段，然后取这几段特征的平均值作为最后的speaker embedding。

<div align=center>
    <img src="zh-cn/img/ch28/p59.png"   /> 
</div>


本节将介绍x-vector方法和思路与d-vector方法的思路类似。x-vector方法由Snyder等2017年提出，并在Kaldi中做了完整的实现。x-vector同样是一种嵌入向量，和d-vector类似，使用说话人标签作为神经网络的分类目标，但是有如下几点独特之处：

+ 前几层为TDNN结构，使用了前后若干帧的信息
+ 使用统计池化层对各帧的TDNN输出进行平均
+ 取池化层后面的隐层（通常为2个）的输出作为嵌入向量

<div align=center>
    <img src="zh-cn/img/ch28/p62.png"   /> 
</div>

<div align=center>
    <img src="zh-cn/img/ch28/p60.png"   /> 
</div>

到了2018 年，出了 x-vector。它会把 每个语音片段通过模型后的输出用一种方式聚合起来，而不是像 d-vector 那样简单的取平均。

x-vector 是d-vector的升级版，它在训练的时候，就考虑了整段声音信号的信息。它会把每一小段的声音信号输出的特征，算一个 mean 和 variance，然后concat起来，再放进一个DNN里去来判断是哪个说话人说的。其他的部分和d-vector一致。

当然，今天我们再来看的时候，会把DNN直接换成RNN就可以了。

以上方法，都是train一个speaker recoganition的模型，然后拿它的特征来做相似度的计算（非 end-to-end模型）。

其相似度计算这部分，也可以直接放进模型里去训练，做成一个end-to-end的模型。

我们的数据集还是和之前的一样，有一堆多个speaker说的话，我们知道每句话是哪个speaker说的。再end-to-end训练的时候，我们会把k段同一个人A说的话放进模型里，得到一个平均之后的特征，然后再从数据集中抽取一段A说的话，作为正样本，抽取一段非A说的话，作为负样本，然后也输入模型得到一个特征。两个特征做相似度的计算，希望正样本下的score越高越好，负样本下的score越低越好。

<div align=center>
    <img src="zh-cn/img/ch28/p61.png"   /> 
</div>

一般来说，x-vector方法的系统比i-vector方法的系统相对要好10个百分点，在Interspeech 2016上有一个关于说话人识别未来十年趋势的研讨会，包括Synder在内的很多学者认为，基于嵌入向量的说话人识别方法将逐渐取代i-vector方法。


### 5.静音检测 VAD

#### 5.1 语音前端算法概述

在语音识别的现实应用环境中，噪声，干扰和混响几乎是无处不在的。在麦克风采集的音频信号中，这些不利因素和目标语音信号叠加在一起，会带来识别率的下降，而在远场环境中更是如此。如下图所示，远场环境中可能同时存在反射声，扬声器回声，干扰用户的声音，方向性噪声和弥散噪声等，这对语音识别系统的准确性提出了很大的挑战。语音前端算法是一组对语音数据进行处理的算法，其目标是从数据中去除这些干扰因素，并尽可能回复原始的纯净语音，从而提升识别率。

<div align=center>
    <img src="zh-cn/img/ch28/p63.png"   /> 
</div>

传统的语音前端算法主要是静音检测(VAD),降噪和回声消除(AEC),下图是一个简单的单通道语音前端处理框架的示意图（根据实际系统的功能和场景，使用的模块和处理顺序可能有所不同）。

<div align=center>
    <img src="zh-cn/img/ch28/p64.png"   /> 
</div>

其中，VAD的一个作用是检测带噪声的音频数据中是否有语音。尽管很简单，但是VAD算法在语音识别交互系统中有着非常重要的作用。有带有语音唤醒功能的Always-On系统中，如智能手机上的语音助手，VAD通常被作为一级算法。该算法一般会一直在后台运行，并在检测到语音时，激活后面级别的语音唤醒和声纹识别算法。由于移动设备对功耗有要求，因此在此场景中通常对VAD算法的复杂度有较大限制。VAD算法的另外一个作用是在处理整段长语音识别时，可以对整段数据进行检测并找到其中每一句话的起始点和终止点，并以此为依据对数据进行分割。此外，VAD算法还是很多其他语音前端处理算法的基础，例如，在降噪或AEC中，可根据VAD的结果来使用不同的策略。

AEC算法的作用是消除本地麦克风采集到的从扬声器中播放出来的远端音频信号。一个典型的例子是，在智能音响中，有些场景需要在播放音乐或语音的同时识别用户指令。由于此时麦克风采集到的声音是目标语音和扬声器声音（这里被称为回声）的混合，因此需要AEC模块来消除回声并恢复纯净的目标语音。为了达到较好的消除效果，AEC模块需要将扬声器播放的音频信号（也被称为回采信号或远端参考信号）作为输入。

降噪又被称为语音增强，主要作用是从语音信号中去除噪声，并尽可能恢复原始的纯净语音。实际环境中的噪声可以分为平稳噪声和非平稳噪声两类。平稳噪声是指统计特性比较稳定或随着时间变化只有缓慢变化的噪声，如风扇声，汽车发动机噪声等；而非平稳噪声是指统计特性快速变化的噪声，现实环境中各种突发的噪声大多属于此类。由于非平稳噪声对语音识别有较大影响，因此对非平稳噪声的消除效果是评价一个降噪算法最关键的部分。

近几年，随着算法和硬件的不断发展，智能音响和车载智能语音交互系统已经越来越普及，人民对远场语音交互的需求也越来越大。在远场语音交互中，随着用户与设备之间的距离的增加，噪声，干扰和混响等因素对语音质量的影响也被放大，并带来语音识别率的下降。传统的单通道语音前端系统在远场应用中不能很好的处理远场语音识别问题。这是因为单通道语音没有空间指向性，在远场环境中无法有效的控制在抑制干扰和同时保留目标信号。而麦克风阵列通过规则排列的麦克风来采集多通道数据，并通过波束形成算法和空间指向性，可以很好的对目标信号进行定向增强，这不仅能抑制弥散噪声，还能抑制方向性的噪声和干扰。麦克风阵列和相应的算法在远场音交互的普及中发挥重要作用。在当前商用的远场音交互场景中，麦克风阵列的使用已经成为标配。

下图是一个典型的麦克风阵列的多通道语音前端系统，其中除了AEC，VAD，降噪等模块，还包括波束形成，声源定位，去混响，增益控制等模块（在实际的应用场景中，模块的组合方式可能有所不同）

<div align=center>
    <img src="zh-cn/img/ch28/p65.png"   /> 
</div>

这里笔者主要介绍VAD,关于其他方面的前端处理算法可以才考相关资料自行学习。


#### 5.2 VAD
<!-- https://blog.csdn.net/gbz3300255/article/details/108973453 -->

VAD算法通常的形式是给一定帧（10-30ms)音频数据，输出该数据中含有语音的概率。通过VAD结果进行平滑及上升沿和下降沿的检测，便可以得到每一句话的起始点和终止点。如何提高VAD算法的抗噪性能是一个非常重要的课题。

VAD算法通常由特征提取和语音或非语音判断两个部分构成。传统的特征提取办法包括过零率，能量值，频谱等，而判决方法主要基于门限的方法和基于统计模型的方法等。在安静的环境下，即使是很简单的VAD算法也可以取得很好的效果。然而在信噪比（SNR)较低的场景中，如何有效的区分语音和噪声，是VAD算法面临的最大挑战，也是核心问题。经过多年的发展，传统方法在大部分情况下已经可以取得比较好的效果。近年来，随着深度学习的兴起，基于神经网络的VAD算法也得到了广泛的应用，在很多场景中可以取得比传统方法更优秀的效果。

##### 5.2.1 基于门限判决的VAD

通过门限对音频信号和特征进行判决是最基础的VAD算法，其中音频特征的选择是关键。一个好的特征需要有比较好的区分能力，即使语音和非语音的分离度尽可能大。此外，还需要考虑特征对背景噪声的鲁棒性。由于VAD要求是一个相对轻量的模型。因此在大部分场景中还需要尽可能考虑其计算力的问题。在早期的VAD算法中，最常用的特征是短时能量和平均过零率等，他们都是时域特征，通过简单方法即可提取。

短时能量是用于语音检测最直观的依据。在信噪比较高的假设下，即假设语音的能量显著大于背景噪声，通过设置一定的阈值便可以通过能量的高低将语音和背景噪声区分。由于语音信号的特征是随着时间变化的，典型的能量值在浊音和清音之间会有很大变化，因此在计算短时能量时，需要一个比较短的窗函数来响应这种款速的能量变化，但窗长也不能太短，否则无法得到平滑的能量变化。对于信号$x(n)$如果有窗函数$w(n)$，并且其长度为$N$,则短时能量可以表示为：

$$E_n=\sum^{N-1}_ {m=0}[x(m+n)w(m)]^2$$

由于语音信号在不同频率范围内的能量差异很大，因此在实际应用中短时能量经常会被拓展到多个子带中。例如，可以将音频信号先通过一组滤波器分别得到0-2kHz,2kHz-4kHz和4kHz-8kHz的子带信号，然后分别计算每个子带的能量，并且为每个子带设置不同的判决阈值。

由于短时能量是对信号的平方计算，因此其动态范围会比原始音频信号更大，即人为放大了高低音量之间的差距。这在某些场景中可能会碰到问题，这时可以根据实际情况使用短时平均幅度来替代短时能量。短时平均幅度的计算方法为：
$$M_n=\sum^{N-1}_ {m=0}|x(m+n)w(m)|$$

音频信号在时域上通常是零均值，采样点平均分布在正负两侧。短时平均过零率是指音频采样点穿过零的次数。即其时域波形穿过x轴的次数。比如如果是正弦信号，则它的平均过零率是信号的频率除以2倍的采样率。由于采样率是固定的，因此过零率可以反应音频时频域上的一些信息。虽然语音信号不是简单的正弦信号，但是短时平均过零率依然可以作为信号频谱特性的一种粗略估计。由于短时平均过零率受高频信号的影像较大，因此可以比较好的过滤掉低频噪声。在实际的应用中短时平均过零率和短时能量可以结合在一起使用。短时能量对噪声的幅度比较敏感，可以过滤掉幅度较低的噪声；而短时平均过零率对噪声的频率比较敏感，可以过滤掉低频噪声，即使其幅度可能很大。

基于短时能量和短时平均过零率，简单的门限判决VAD算法主要适用于安静环境或者噪声源比较单一的环境，而在非平稳噪声较多的环境中，其性能会急剧下降，这时可以使用基于统计模型的算法。

##### 5.2.2 基于高斯混合模型的VAD

基于GMM的VAD算法是一种最典型的的统计模型方法。在Google公司的WebRTC开源项目中，便使用了此类算法进行语音检测。以下以WebRTC为例，介绍基于GMM的VAD算法的基本流程。

首先在特征的选取方面，WebRTC采用了子带的能量作为特征。WebRTC支持8kHz,16kHz,32kHz,48kHz等多种不同采样率，在进行VAD处理之前，他们被统一降采样到8kHz.根据奈奎斯特采样定理，其支持的最高信号频率为4kHz。WebRTC将4kHz的频带分为6个子带，分别为80-250Hz,250-500Hz,500-1kHz,1kHz-2kHz,2kHz-3kHz,3kHz-4kHz。输入的音频信号先通过一组滤波器得到上述子带信号，然后计算每个字带的能量作为特征。

对于每个子带的能量，分别有一个GMM进行建模。单高斯模型只有一个峰值，而对于语音信号，使用单高斯模型不能很好的建模。WebRTC使用的是两个高斯模型的混合。在每个子带中，语音和噪声分别有一个GMM进行建模。

在进行判决时，对每个子带计算一个二元高斯对数似然函数。再各个子带似然比的基础上，再进行一个全局似然比。

接下来，对每个子带的似然比和全局似然比进行一次门限判决，具体的门限值有实验和经验给出。为了避免楼盘语音，子带似然比和全局似然比中有任何一个超过了设定的阈值，最终的判决结果都会认为信号中存在语音。WebRTC中有四组预设的门限值，分别对应4种不同的检测模式0：通用模式，1：低比特率模式；2：激进模式；3：非激进模式。按照数字大小，4种门限值依次增大，即检出语音的标准越来越高。

在判决之后需要对GMM的参数进行更新。根据当前VAD的判决结果，WebRTC只进行语音或噪声模型的更新，判决是1只进行语音模型更新，判决是0只进行噪声模型的更新，更新的方式是梯度下降。

以上的VAD算法通过子带的特征计算和高斯混合模型的自适应更新，实现了比门限判决法具有更高的鲁棒性。

##### 5.2.3 基于神经网络的VAD

<!-- https://zhuanlan.zhihu.com/p/24432663 -->

基于统计模型的算法主要依赖几个子带内预设的能量分布模型，对语音和噪声进行区分，这在信噪比较低，或者非平稳噪声，尤其是突发性噪声较多的场景中依然存在误检率较高的情况。

近年来，随着深度学习技术的兴起，基于神经网络的VAD算法逐渐得到了广泛应用（Sainath 2016;Tong,2016;Kim 2018)。由于神经网络方法是从大量的训练数据中学习语音频谱与噪声频谱的规律并加以区分，因此训练后的模型能够准确的区分语音的频谱和非语音的频谱，提高了VAD算法的抗噪声和抗干扰性能。智能硬件和智能手机的语音助手已经广泛搭载了基于神经网络的VAD算法，用来进行第一级的激活检测，并且在很多专用的语音芯片中也集成了专用的VAD算法。此外，在WebRTC项目中，除了传统的基于GMM的VAD，也已经包含了一个测试版的基于神经网络的VAD算法（位于ACC2模块中）。

对于神经网络，VAD通常可以被理解为一个简单的二分类问题，即对每一帧的语音输入，都需要将其划分为0（非语音）1（语音）两类。由于VAD对功耗和实时性要求比较高，因此使用的模型都比较简单，下图展示了一个典型的基于神经网络的VAD算法的整体流程和模型结构（Sainath 2016)

<div align=center>
    <img src="zh-cn/img/ch28/p66.png"   /> 
</div>

该算法的具体步骤：先通过一个滑动窗，将时域波形分帧，并进行离散快速傅里叶变换得到信号的频谱。滑动窗口的配置可以和语音识别的一致，即宽度是25ms,帧移是10ms。随后使用一个包含64个Gammatone滤波器组对每一帧信号的频谱进行频域滤波，并得到一组64维的特征。这里的滤波器组也可以替换为Mel滤波器组或其他的频域特征提取办法。他们的共同点是根据人耳的听觉特性，针对不同的中心频率有不同的频域分辨率。在低频处的子带数量较多，且每个子带的带宽较窄，颗粒度较细；在高频处的子带数量较少且每个子带的宽度都会增加，颗粒度较粗。所使用的64子带Gammatone滤波器组的幅频相应如下图所示：

<div align=center>
    <img src="zh-cn/img/ch28/p67.png"   /> 
</div>


在这个例子中，信号的64个滤波器的中心频率在对数域上均匀分布，其数值分别为：

$$f_c(i)=-228.7+\frac{f_s/2+228.7}{exp(0.108i\times sf)}$$

其中$i$是子带的序号，$f_s$是采样频率，而$sf$是对属于域上的频率间隔，由下式给出：

$$sf=\frac{1}{N}[9.26[log(\frac{f_s}{2}+228.7)-log(f_{min}+228.7)]]$$

其中$N$是子带的个数，而$f_{min}$是最低频率，对语音信号来说可取$f_{min}=50$。由于我们的滤波器是在频域上计算且只计算幅度谱而舍弃了相位，因此可以用下面的近似公式来计算每个子带的幅频响应：
$$|H(f)|^2=[\frac{c}{2}(n-1)!(2\pi b)^{-n}]^2[1=\frac{(f-f_c)^2}{b^2}]^{-n}$$
其中$c$为常数，$n$是滤波器的阶数，$b$是滤波器的衰减系数，他们直接决定了该滤波器的等效矩形带宽（ERB).所谓等效矩形带宽是指等效矩形滤波器的带宽。给定一个任意的功率谱，存在一个对应的等效矩形滤波器，这个矩形带通滤波器的增益就是给定功率谱的最大值，而该矩形滤波器的功率谱的总和与给定功率谱的总和相等。ERB与b的换算关系如下：
$$ERB=\frac{(2n-2)!2^{2-2n}\pi}{[(n-1)!]^2}b$$

通常先根据需求指定ERB,按照上述关系得到b的值。

完成特征提起后。需要对特征进行归一化操作。为了使算法能够跟踪和适应不同的场景，以及变化的信号增益，可以在运行过程中根据提取的特征实时更新归一化的参数。

接下来64维的音频信号特征输入到神经网络。结合历史信息，模型会对当前帧进行预测，输出该帧信号含有语音的概率。根据实际需求，该推理可以逐帧或多帧进行一次。该模型包含一个1d卷积，两个LSTM层，以及一个带有softmax的全连接层。首先1d卷积对输入的频谱特征进行频域上的卷积，提取频域能量蕴含的信息。两个LSTM对输入特征在时域上的变化情况进行建模。LSTM的输出经softmax做二分类，输出当前帧含有语音的概率。

输出的概率通过后处理步骤（如中值滤波器等）进行平滑，滤除过短的毛刺信号，并输出最终的判决值，即决定该信号帧是否包含语音。

在实际应用中由于一般对VAD的功耗和实时性要求很高，因此还需要采用剪枝，量化等手段对模型的尺寸和算力需求做进一步压缩。