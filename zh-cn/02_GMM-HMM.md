## GMM-HMM

<!-- https://blog.csdn.net/qq_42734492/article/list/2 -->

### 1.HMM

<!-- markdown 插入pdf -->
<object data="zh-cn/img/ch2/隐马尔可夫模型(1).pdf" type="application/pdf" width=100% height="750px">
    <embed src="http://www.africau.edu/images/default/sample.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="zh-cn/img/ch2/隐马尔可夫模型(1).pdf">Download PDF</a>.</p>
    </embed>
</object>


!> HMM中的三大问题

+ **概率计算问题**。即给定模型λ=(A,B,Π)和观测序列O={o1,o2,...oT}，计算在模型λ下观测序列O出现的概率P(O|λ)。这个问题的求解需要用到前向算法、后向算法和直接计算法。

+ **解码问题**。即给定模型λ=(A,B,Π)和观测序列O={o1,o2,...oT}，求给定观测序列条件下，最可能出现的对应的状态序列，这个问题的求解需要用到基于动态规划的Viterbi算法。

+ **模学习问题**。即给定观测序列O={o1,o2,...oT}，估计模型λ=(A,B,Π)的参数，使该模型下观测序列的条件概率P(O|λ)最大。这个问题的求解需要用到基于EM算法的Baum-Welch算法。

我们在PDF中已经给出概率计算问题的求解方法，现在说明解码问题的求解。解码问题（又叫对齐问题、预测问题、序列标注问题、求隐状态问题）。即给定模型λ=(A,B,Π)和观测序列O={o1,o2,...oT}，求给定观测序列条件下，最可能出现的对应的状态序列，这个问题的求解需要用到基于动态规划的Viterbi算法。Viterbi算法是最优路径算法的一种。最优路径算法还有：

+ 穷举法
    - 方法：把所有可能路径都计算一遍，最优路径自然就出来了。
    - 优点：必然能找到最优路径。
    - 缺点：计算量太大。
+ A*算法
    - 方法：每一步只走最好走的路（目光短浅）
    - 优点：计算快，而且这种贪心或者说启发式的算法，通常情况下，效果还是不错的。
    - 缺点：很难找到最优解，陷入局部最优
+ beam search （波束搜索）
    - 方法：每一步只走最好走的前N条路。这里的N也叫Beam Width。是A* 算法的改进，当N=1时，退化为A*算法，当N=N时，退化为穷举法。
    - 优点：N设置良好的话效果不错。
    - 缺点：Beam Width越大，找到最优解的概率越大，相应的计算复杂度也越大
+ Viterbi算法
    - 方法：记录每个时刻的每个可能状态的之前最优路径的概率，同时记录最优路径的前一个状态，不断向后迭代，找到最后一个时间点的最大概率值对应的状态，回溯找到最优路径。
     
<div align=center>
    <img src="zh-cn/img/ch2/p1.png" /> 
</div>
    
注意：Viterbi算法前向时只是计算概率，并记住，后向回溯时才得到最优路径。

<div align=center>
    <img src="zh-cn/img/ch2/p2.png" /> 
</div>

<div align=center>
    <img src="zh-cn/img/ch2/p4.png" /> 
</div>

关于学习问题（又叫训练问题、参数估计、求模型问题）使用Viterbi学习算法、Baum-Welch算法，这里不再赘述。

!> HMM的隐状态（隐状态、箱子、第K个高斯）

隐藏状态是抽象出来的概念，由于语音信号在一个长时间断内是非平稳信号，而在一个较短的时间内则可近似看做平稳的(比如50毫秒)。平稳信号的特点在于信号的频谱分布是稳定的，不同时间段的频谱分布相似。隐马尔可夫模型将一小段频谱相似的连续信号归为一个隐状态。Viterbi算法对齐就是为了找到哪些帧归于哪个隐状态，隐马尔可夫模型的训练过程是最大化似然度，每一个状态产生的数据用一个概率分布表示(GMM)。只有当相似的连续信号尽可能被归为同一个状态，似然度才能尽可能的大

<div align=center>
    <img src="zh-cn/img/ch2/p7.png" /> 
</div>

类比箱子和小球，手从哪个箱子拿的球不知道，只知道拿出来后看见的小球，问小球来自哪个箱子的可能。其中，箱子就是隐状态，小球就是可观测的。箱子中有不同小球的比例，或者分布，而HMM中也有隐状态对应到特征向量的概率分布。假如箱子中小球分布符合高斯分布，假设HMM中隐状态中特征符合高斯分布，GMM混合高斯模型就是在模拟这个分布，理解性的表达可以说模拟隐状态中可观测特征的比例。只不过一个箱子中三个小球比列为`3:2:1`，而HMM一个隐状态中有39种特征，也是有占比。

<div align=center>
    <img src="zh-cn/img/ch2/p8.png" /> 
</div>


### 2.GMM

1.GMM基础

高斯混合模型（GMM）指的是多个高斯分布函数的线性组合，理论上GMM可以拟合出任意类型的分布，通常用于解决同一集合下的数据包含多个不同的分布的情况。

!> 为什么GMM可以拟合出任意类型的分布？

不仅GMM可以，只要性质不太奇怪的混合模型一般都能近似任意分布。这个思想和泰勒展开、傅里叶变换是类似的，任何波形都可以用正弦波叠加表示，而且频率还是基频的整数倍。

利用高斯混合模型进行聚类，本质上可以这么理解：

数据的分布由若干高斯分布组合而成，需要通过传入的无标记数据，求解出各个高斯模型的参数和各个模型的先验概率！不同于一般利用最大似然估计参数的情况在于由于传入的数据无标记，也就是说缺少了观测数据的类别这个隐藏信息，所以这个隐藏信息的概率分布也成了估计内容之一，从而无法通过求偏导进行梯度下降来求解，于是利用了EM

设有随机变量$X$，则混合高斯模型可以用下式表示：

<div align=center>
    <img src="zh-cn/img/ch2/p9.png" /> 
</div>
其中$N(x| \mu _k,\Sigma_k)$称为混合模型中的第$k$个分量。

<div align=center>
    <img src="zh-cn/img/ch2/p10.png" /> 
</div>

其中，$\mu \in  𝑹^𝑫$,为高斯分布的均值向量， $\Sigma \in 𝑹^{𝑫×𝑫}$，为高斯分布的协方差矩阵。

若有三个聚类，可以用三个二维高斯分布来表示，那么分量数`K=3`。 $π_k$是混合系数，且满足：

<div align=center>
    <img src="zh-cn/img/ch2/p11.png" /> 
</div>

可以认为$π_k$就是每个分量$N(x| \mu _k,\Sigma_k)$的权重。

<div align=center>
    <img src="zh-cn/img/ch2/p12.png" width=30%/> 
</div>

2.GMM的隐变量

隐变量是一个辅助变量，GMM的隐变量表示的是样本$x$属于哪一个高斯分布。隐变量是一个向量，并且这个向量中只有一个元素取值为1，其它的都是0。因为假设只有一个高斯分量被选中并产生观测数据。然而我们的GMM的一个观测数据在直观上应该是每个高斯分量都有产生，而不是由一个高斯分量单独生成，只是重要性不同（由系数控制）

假设我们知道数据可以分为两类，在随机抽取一个数据点，不知道这个数据来自第一类还是第二类，类比GMM中K1、K2的高斯分模型，不知道数据来自哪个分模型。

隐变量就是为了描述数据归属看不见这个现象的。隐变量是一个离散的随机变量。GMM中K1、K2、K3类比箱子1、箱子2、箱子3，类比HMM中状态1、状态2、状态3 (见HMM中的图示)。

3.GMM的训练问题

+ 极大似然估计

利用不完全数据（只有观测数据）的边缘分布。给定一些观测数据`X={x}`，假设`{x}`符合混合高斯分布:
<div align=center>
    <img src="zh-cn/img/ch2/p13.png" /> 
</div>

求解一组混合高斯模型的参数使得：

<div align=center>
    <img src="zh-cn/img/ch2/p14.png" /> 
</div>

对目标函数取对数：

<div align=center>
    <img src="zh-cn/img/ch2/p15.png" /> 
</div>

对数似然函数分别对参数𝜋, 𝝁, 𝚺求导，使得导数等于0，来更新参数。

目标函数是和的对数，这时候求导比较困难，形式复杂，同时，还有个问题就是求一个参数的时候会依赖其他参数的值，但是其他参数的值其实也是未知的，也是待估计的。因此需要EM算法。


+ EM算法估计

利用完全数据的联合概率分布。

完全数据的似然函数：

<div align=center>
    <img src="zh-cn/img/ch2/p16.png" /> 
</div>

取对数：

<div align=center>
    <img src="zh-cn/img/ch2/p17.png" /> 
</div>

计算𝐙的后验概率：

<div align=center>
    <img src="zh-cn/img/ch2/p18.png" /> 
</div>

完全数据的对数似然关于潜变量的期望值Q函数：

<div align=center>
    <img src="zh-cn/img/ch2/p19.png" /> 
</div>

对参数𝜋, 𝝁, 𝚺求导，使得导数等于0，来更新参数。（过程中应用到拉格朗日乘子法）

<div align=center>
    <img src="zh-cn/img/ch2/p20.png" /> 
</div>
<div align=center>
    <img src="zh-cn/img/ch2/p21.png" /> 
</div>
<div align=center>
    <img src="zh-cn/img/ch2/p22.png" /> 
</div>
<div align=center>
    <img src="zh-cn/img/ch2/p23.png" /> 
</div>

4.EM算法深入理解

!> 推荐：[【人人都能看懂的EM算法推导】](https://mp.weixin.qq.com/s?__biz=MzI1MjQ2OTQ3Ng==&mid=2247573110&idx=1&sn=8ef6370c65050495ceadfa6b87378c91&chksm=e9e0d7fdde975eeb6ec92ec1cf645daa0357ffdb1d3c07d40c6786f3af61fab9fbf2d1ca60a3&scene=27)

+ 第一层：E期望+M最大化(看山是山)（直观理解）

所谓直观理解就是将EM分成E步+M步进行组合。

隐变量的似然度：

<div align=center>
    <img src="zh-cn/img/ch2/p24.png" width=20% /> 
</div>

E-step:

<div align=center>
    <img src="zh-cn/img/ch2/p25.png" width=20%/> 
</div>

M-step:

<div align=center>
    <img src="zh-cn/img/ch2/p26.png" width=20%/> 
</div>

+ 第二层：局部下限构造（看山是沙）（细致入微）

细致入微看看E步M步的本质。

补充知识：

a) Jenson不等式

<div align=center>
    <img src="zh-cn/img/ch2/p27.png" /> 
</div>

b) 条件概率

<div align=center>
    <img src="zh-cn/img/ch2/p28.png" /> 
</div>

<div align=center>
    <img src="zh-cn/img/ch2/p29.png" width=20%/> 
</div>

c) 联合分布求和等于边缘分布

<div align=center>
    <img src="zh-cn/img/ch2/p30.png" /> 
</div>

深入到基于隐变量的EM算法的收敛性证明， 基于log(x)函数的Jensen不等式构造， 容易证明，EM算法是在反复的构造新的下限，然后进一步求解。

<div align=center>
    <img src="zh-cn/img/ch2/p31.png" /> 
</div>

------

<div align=center>
    <img src="zh-cn/img/ch2/p33.png" /> 
</div>

在之前的EM算法中，E步所计算的$Q(\theta,\theta_{old})$实际上等价于计算$L(q,\theta)$

从参数空间理解EM算法：

红线表示观测数据的对数似然，蓝线表示在原始参数下，下边界$L(q,\theta)$的变化，在M步，最大化下边界$L(q,\theta)$ 关于参数θ，得到新的参数，此时得到的新的下边界绿线所示，继续进行E步和M步，直到达到观测数据的最大似然。

先固定当前参数， 计算得到当前隐变量分布的一个下届函数， 然后优化这个函数， 得到新的参数， 然后循环继续。

+ 第三层：K-均值方法是一种Hard EM算法（看峰是山）（举一反三）

举一反三，概率的极端是0和1，那么K-means也是EM算法的一种。

k均值聚类算法是一种迭代求解的聚类分析算法，其步骤是：

<div align=center>
    <img src="zh-cn/img/ch2/p35.png" /> 
</div>

k均值聚类是使用EM算法。K-均值在讨论隐变量的决定时候，用的是dirac delta 分布， 这个分布是高斯分布的一种极限。

<div align=center>
    <img src="zh-cn/img/ch2/p37.png" /> 
</div>

+ 第四层：EM 是 广义EM的特例（看山是群山峻岭）

广义EM包括传统EM和类似K-means算法的其他EM。充分理解了k-均值和EM算法本身的演化和差异可以理解到隐变量是存在一种分布的。
跨过隐变量，进入隐分布的境界。只要满足E步骤是固定参数优化隐分布， M步骤是固定隐分布优化参数，都是广义EM算法。

!> Example: [用GMM识别0-9的语音识别系统](https://blog.csdn.net/qq_42734492/article/details/108263140)

### 3.GMM-HMM声学模型

基于GMM的0-9孤立词识别系统以词为训练单位，添加新词汇需要重新进行训练，若要涵盖所有词，差不多6万个词，训练量极大，预测时也要计算6万个模型的似然，哪个大预测出哪个，在实际应用中有局限性，只能应用于小词汇量场合。

孤立词识别系统识别了0-9的数字的英文单词，但是假如有人用英文报电话号码，是识别不了整个号码的，甚至识别不了其中的one。孤立词识别这个模型无法从一连串英文号码（里面包含了one two等多个数字）中准确识别出one，关键点在于连续语音中不知道哪些语音信号是one，哪些是two，或者说不知道哪些帧是one哪些帧是two。

所以若要识别连续的0123456789的语音就需要Viterbi在HMM中进行对齐，这就是GMM-HMM模型了。

1.识别流程

<div align=center>
    <img src="zh-cn/img/ch2/p39.png" /> 
</div>

在GMM独立词识别中以单词为单位建模，在GMM-HMM中以音素为单位进行建模。对连续语音提取MFCC特征，将特征对应到状态这个最小单位，通过状态获得音素，音素再组合成单词，单词串起来变成句子。

其中，若干帧对应一个状态，三个状态组成一个音素，若干音素组成一个单词，若干单词连成一个句子。难点并在于若干帧到底是多少帧对应一个状态了，这就使用到了viterbi对齐。 为了提高识别率，在三音子GMM-HMM模型基础上，又用DNN模型取代GMM模型，达到了识别率明显的提升。

<div align=center>
    <img src="zh-cn/img/ch2/p40.png" /> 
</div>

将特征用混合高斯模型进行模拟，把均值和方差输入到HMM的模型里。**GMM描述了状态的发射概率，拟合状态的输出分布。**单音素模型虽然可以完成基本的大词汇量连续语音识别的任务，但是存在一定缺点。

+ 建模单元数目少，一般英文系统的音素数量在30～60个，中文系统音素数目在100个左右。这么少的建模单元难以做到精细化的建模，所以识别率不高。
+ 音素发音受其所在上下文的影响，同样的音素，在不同的上下文环境中，数据特征也有明显的区分性。

所以就考虑音素所在的上下文(context)进行建模，一般的，考虑当前音素的前一个（左边）音素和后一个（右边）音素，称之为三音素，并表示为A-B+C的形式，其中B表示当前音素，A表示B的前一个音素，C表示B的后一个音素。

<div align=center>
    <img src="zh-cn/img/ch2/p41.png" /> 
</div>

2.单音素模型

+ 训练问题

一段2秒的音频信号，经过`【分帧-预加重-加窗-fft-mel滤波器组-DCT】`，得到MFCC特征作为输入信号，此处若以帧长为25ms，帧移为25ms为例，可以得到80帧的输入信号，这80帧特征序列就是观察序列：

<div align=center>
    <img src="zh-cn/img/ch2/p42.png" /> 
</div>

给定观察序列O，估计GMM-HMM模型的参数，这就是训练问题。

<div align=center>
    <img src="zh-cn/img/ch2/p43.png" /> 
</div>

A是转移概率，B是观察概率，也就是发射概率。我们使用GMM模型对观察概率建模，所以实际参数就是高斯分布中的均值和方差。模型参数就是转移概率、高斯分布的均值、方差（单高斯的情况）。单音素GMM-HMM模型的训练是无监督训练。

!> 我们对语音进行了标注，也就是给了输入语音的label，为什么这个训练还是无监督的呢？

模型的训练并不是直接输入语音，给出这个语音是什么，然后和标注label求loss。模型的训练是输入特征到音素的状态的训练，即我们并不知道哪一帧输入特征对应哪个音素的哪一个状态。训练的目的就是找到帧对应状态的情况，并更新状态的GMM参数。把每一帧都归到某个状态上，本质上是进行聚类，是无监督训练。）

单音素GMM-HMM模型的训练通过Viterbi训练(嵌入式训练)，把“S IH K S”对应的GMM模型嵌入到整段音频中去训练。

<div align=center>
    <img src="zh-cn/img/ch2/p44.png" /> 
</div>

+ step1: 初始化对齐

为什么要初始化对齐？是为Viterbi提供初始参数A、B。

一开始不知道一段语音的哪些帧对应哪些状态，我们就进行平均分配。比如两秒的“ six”语音一共80帧，分成四个因素“S IH K S”，每个音素分配到20帧，每个音素又有三个状态组成，每个状态分配6或者7帧。这样就初始化了每个状态对应的输入数据。

!> 什么意思？

就是假设前0-20帧数据都是“S”这个音素的发音，20-40帧数据都是“IH”这个音素的发音，40-60帧是“K”这个音素的发音，60-80是“S”这个音素的发音。但这只是一个假设，事实到底如此我们还不知道。我们可以在这个初始对齐下进一步优化。

<div align=center>
    <img src="zh-cn/img/ch2/p45.png" /> 
</div>

+ step2:初始化模型

HMM模型λ=(A,B,Π)。我们对初始对齐的模型进行count。count什么呢？

在初始化对齐后就可以count`状态1->状态1的次数`，`状态1->状态2的次数`，这就是转移次数，`转移次数/总转移次数=转移概率`。转移初始转移概率$A(a_{ij})$就得出了。

Π就是`[1,0,0,0...]`，一开始在状态一的概率是100%。在语音识别应用中由于HMM是从左到右的模型，第一个必然是状态一，即$P(q_0=1)=1.0$。所以没有$p_i$这个参数了。

还有$B(b_j(o_t))$参数怎么办？

一个状态对应一个GMM模型，一个状态对应若干帧数据，也就是若干帧数据对应一个GMM模型。一开始我们不知道哪些帧对应哪个状态，所以GMM模型的输入数据就无从得知。现在初始化后，状态1对应前6帧数据，我们就拿这六帧数据来计算状态1的GMM模型（单高斯，只有一个分量的GMM），得到初始均值和方差。

!> 假设我们初始化分配帧恰恰就是真实的样子，那么我们的gmm参数也是真实的样子，这个模型就已经训练好了。

+ step3: 重新对齐（viterbi硬对齐，Baum-welch软对齐）

现在得到的GMM-HMM模型就是个胚芽，还有待成长，懂事，这就需要重新对齐，向真实情况逼近的重新对齐。如何逼近真实情况？Viterbi算法根据初始化模型λ=(A,B,Π)来计算。它记录每个时刻的每个可能状态的之前最优路径概率，同时记录最优路径的前一个状态，不断向后迭代，找出最后一个时间点的最大概率值对应的状态，如何向前回溯，得到最优路径。得到最优路径就得到最优的状态转移情况，哪些帧对应哪些状态就变了。转移概率A就变了。

哪些帧对应哪些状态变了导致状态对应的GMM参数自然就变了，也可以跟着更新均值和方差，即发射概率B变了。

+ step4: 迭代

新的A和新的B又可以进行下一次的Viterbi算法，寻找新的最优路径，得到新的对齐，新的对齐继续改变着参数A、B。如此循环迭代直到收敛，则GMM-HMM模型训练完成。

!> 迭代何时是个头？

一般是设置固定轮数，也可以看一下对齐之后似然的变化，如果变化不大了，基本就是收敛了。

3.三音子模型

+ 决策树

考虑音素所在的上下文(context)进行建模，一般的，考虑当前音素的前一个（左边）音素和后一个（右边）音素，称之为三音素，并表示为`A-B+C`的形式，其中B表示当前音素，A表示B的前一个音素，C表示B的后一个音素。

使用三音素建模之后，引入了新的问题：

1.$N$个音素，则共有$N^3$ 个三音素，若$N=100$，则建模单元又太多了，每个音素有三个状态，每个状态对应的GMM参数，参数就太多了

2.数据稀疏问题，有的三音素数据量很少

3.unseen data问题。有的三音素在训练数据没有出现，如`K-K+K`，但识别时却有可能出现，这时如何描述未被训练的三音素及其概率

所以通常我们会根据数据特征对triphone的状态进行绑定，常见的状态绑定方法有数据驱动聚类和决策树聚类，现在基本上是使用决策树聚类的方式。

三音素GMM-HMM模型是在单音素GMM-HMM模型的基础上训练的。

!> 为什么要先进行单音素GMM-HMM训练？

通过在单音素GMM-HMM模型上Viterbi算法得到与输入 对应的最佳状态链，就是得到对齐的结果。对每个音素的每个state建立一颗属于他们自己的决策树，从而达到状态绑定的目的。

<div align=center>
    <img src="zh-cn/img/ch2/p46.png" /> 
</div>

+ 决策树建立的基本单元是状态，对每个三音子的每个state建立一颗属于他们自己的决策树。
+ 每个三音素对于该问题都会有一个Yes或No的的答案，那么对所有的三音素来讲，该问题会把所有三音素分成Yes集合和No集合。
+ 根节点是说这是以`zh`为中心音素的三音素的第三个状态的决策树，第一个状态和第二个状态也都有各自独立的决策树
+ 即使`zh-zh+zh`从未在训练语料中出现过，通过决策树，我们最终将它绑定到一个与之相近的叶子节点上。

通过单音素系统，我们可以得到单音素各个状态所有对应的特征集合，做一下上下文的扩展，我们可以得到三音素的各个状态所有对应特征集合。通过这样的方法，我们可以把训练数据上所有的单音素的数据对齐转为三音素的对齐。

决策树的生成流程：

+ 初始条件（单音素系统对齐，一个根节点）
+ 选择当前所有待分裂的节点、计算所有问题的似然增益，选择使似然增益最大的节点和问题对该节点进行分裂。
+ 直至算法满足一定条件终止。

4.总结

从单音素GMM-HMM到三音子GMM-HMM的过程就是发现问题，解决当前问题又引入了新问题，再解决新问题的过程。 单音素建模单元少，难以做到精细化建模，识别率不高，单音素发音受上下文影响。 为了优化或者说解决这些问题，引进三音子模型，导致建模单元又太多，所谓过犹不及。同时还出现数据稀疏问题，unseen data问题。 为了解决这些问题，引入带决策树的GMM-HMM模型，解决了上面问题。 为了提高识别率，在三音子GMM-HMM模型基础上，又用DNN模型取代GMM模型，达到了识别率明显的提升。

GMM-HMM作为最基础的声学模型，其应用仍然十分广泛，后期慢慢引申出了Tandem,DNN-HMM Hybrid的基于神经网络和HMM混合的模型，到现在主流的端到端的ASR结构。

!> Example: [【基于GMM-HMM的连续语音识别系统】](https://blog.csdn.net/qq_42734492/article/details/108920257)