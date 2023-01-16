class MineSweep {
    constructor() {
        this.gridNumPerRow = 10
        this.mineNum = 20
        this.gridValues = []
        this.gridHasMine = []
    }
    init() {
        this.generateMines()
        this.setGridValue()
        this.generateBoard()
    }

    /**
     *  生成扫雷基本的格子，直接用div，借助css grid
     */
    generateBoard() {
        console.log(this.gridHasMine)
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('board-wrapper')
        document.body.appendChild($wrapper)

        let $grid;
        for (let i = 0; i < this.gridNumPerRow * this.gridNumPerRow; i++) {
            $grid = document.createElement('div')
            $grid.classList.add('grid')
            $wrapper.appendChild($grid)

            if (this.gridValues[i] == -1) {
                // 插入雷元素
                $grid.innerHTML = `<img src="./mine.png" class="hidden hasMine mine-img"></span>`
            } else if (this.gridValues[i] > 0) {
                $grid.innerHTML = `<span class="hidden">${this.gridValues[i]}</span>`
            }

            $grid.onclick = this.handleClickGrid
        }
    }

    /**
     *  格子被点击后的处理 
     */
    handleClickGrid(e) {
        let $hiddenContent

        // 避免只将图片部分或文字背景改变，而整个方框背景未变
        if (e.target.tagName == 'IMG' || e.target.tagName == 'SPAN') {
            $hiddenContent = e.target
            e.target.parentNode.style.backgroundColor = 'yellow'
        } else {
            e.target.style.backgroundColor = 'yellow'
            $hiddenContent = e.target.firstChild
        }

        // 为空说明value为0
        if (!$hiddenContent) {
            return
        }

        // 点到雷后显示所有隐藏内容
        if ($hiddenContent.classList.contains('hasMine')) {
            const $hiddens = document.getElementsByClassName('hidden')
            while ($hiddens.length) {
                $hiddens[0].classList.remove('hidden')
            }

            // 下面这段代码会有问题！
            // for (let i = 0; i < $hiddens.length; i++) {
            //     $hiddens[i].classList.remove('hidden')
            // }

        } else {
            // 加上判断，避免多次点击同一个格子报错
            if ($hiddenContent.classList.contains('hidden')) {
                $hiddenContent.classList.remove('hidden')
            }
        }
    }


    /**
     *  随机生成雷的位置
     *  要点是要注意不能有重复位置的雷
     */
    generateMines() {
        const res = []

        // 用0-99代表每一个格子
        let mineGrid

        for (let i = 0; i < this.mineNum; i++) {
            // 如果有重复，则继续生成
            do {
                mineGrid = parseInt(Math.random() * 100)
            }
            while (res.includes(mineGrid))

            // 放入结果数组中
            res.push(mineGrid)
        }
        this.gridHasMine = res
    }

    /**
     * 为每个格子设置对应的值，-1代表有雷，其他数字代表周围九宫格内雷的个数
     */
    setGridValue() {
        // 设置100个默认值
        const gridCount = this.gridNumPerRow * this.gridNumPerRow
        for (let i = 0; i < gridCount; i++) {
            this.gridValues.push(0)
        }

        // 用一个数组存放周围的8个格子的index，如果不存在设置为null
        let arroundGrids

        for (let i = 0; i < this.gridHasMine.length; i++) {
            // 获取当前雷对应的格子
            const currGrid = this.gridHasMine[i]

            // 先将雷对应的格子设置为-1
            this.gridValues[currGrid] = -1

            arroundGrids = this.getAroundGrids(currGrid)

            //将周围存在的格子value加1
            // 需要注意如果周围格子已经有雷，则不需要进行加1操作
            for (let i = 0; i < arroundGrids.length; i++) {
                if (arroundGrids[i] && this.gridValues[arroundGrids[i]] != -1) {
                    this.gridValues[arroundGrids[i]]++
                }
            }
        }
    }

    /**
     *  获取周围九宫格内格子对应的index
     */
    getAroundGrids(currGrid) {
        let one = this.isValidGridNumber(currGrid - 11) ? currGrid - 11 : null
        let two = this.isValidGridNumber(currGrid - 10) ? currGrid - 10 : null
        let three = this.isValidGridNumber(currGrid - 9) ? currGrid - 9 : null
        let four = this.isValidGridNumber(currGrid - 1) ? currGrid - 1 : null
        let five = this.isValidGridNumber(currGrid + 1) ? currGrid + 1 : null
        let six = this.isValidGridNumber(currGrid + 9) ? currGrid + 9 : null
        let seven = this.isValidGridNumber(currGrid + 10) ? currGrid + 10 : null
        let eight = this.isValidGridNumber(currGrid + 11) ? currGrid + 11 : null

        // 没有左边格子的话1、4、6对应的都去掉
        if (this.notHasLeftNeighbour(currGrid)) {
            one = null
            four = null
            six = null
        }

        // 没有右边格子的话3、5、8对应的都去掉
        if (this.notHasRightNeighbour(currGrid)) {
            three = null
            five = null
            eight = null
        }

        return [one, two, three, four, five, six, seven, eight]
    }

    /**
     *  判断是否左边没有格子
     */
    notHasLeftNeighbour(index) {
        return index % 10 == 0
    }

    /**
     *  判断是否右边没有格子
     */
    notHasRightNeighbour(index) {
        return index % 10 == 9
    }

    /**
     *  判断是否是存在的格子
     */
    isValidGridNumber(num) {
        return num >= 0 && num <= 99
    }

}