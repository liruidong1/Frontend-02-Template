class Heap {

    //二叉堆
    //完全二叉树 节点i 的左儿子为 2*i+1 右儿子为 2*i+2 父节点为Math.floor((i-1)/2)
    //maxHeap 默认为false 指示为小顶堆
    constructor(data, compare = (v1, v2) => v1-v2, maxHeap = false) {
        this.data = data;
        this.compare = compare;

        this.maxHeap = (function () {
            return function (){
                return maxHeap;
            }
        })();
    }

    heapingUpDown(data) {
        let len = data.length;
        let firstIndex = 0;
        let first = data[firstIndex];


        if(this.maxHeap()){
            //大顶堆
            while (firstIndex < len) {
                let leftIndex = firstIndex * 2 + 1;
                let rightIndex = firstIndex * 2 + 2;
                let nextIndex = leftIndex;

                //比较左右儿子谁大
                if(rightIndex < len && rightIndex < len) {
                    if(this.compare(data[leftIndex], data[rightIndex]) < 0) {
                        nextIndex = rightIndex;
                    }
                    if(this.compare(first, data[nextIndex]) < 0) {
                        data[firstIndex] = data[nextIndex];
                        firstIndex = nextIndex;
                    }else{
                        break;
                    }
                }else {
                    break;
                }


            }
            data[firstIndex] = first;
        }else{
            //小顶堆
            while (firstIndex < len) {
                let leftIndex = firstIndex * 2 + 1;
                let rightIndex = firstIndex * 2 + 2;
                let nextIndex = leftIndex;

                //比较左右儿子谁小，取最小

                if(rightIndex < len  && rightIndex < len) {
                    if(this.compare(data[leftIndex], data[rightIndex]) > 0) {
                        nextIndex = rightIndex;
                    }

                    if(this.compare(first, data[nextIndex]) > 0) {
                        data[firstIndex] = data[nextIndex];
                        firstIndex = nextIndex;
                    }else{
                        break;
                    }
                }else {
                    break;
                }

            }
            data[firstIndex] = first;
        }
    }

    take(){
        let len = this.data.length;
        let item = this.data[0];
        this.data[0] = this.data[len - 1];
        this.data.pop();
        if(len > 1) {
            this.heapingUpDown(this.data);
        }
        return item;
    }

    heapingUp(data){
        let len = data.length;
        let lastIndex = len-1;
        let last = data[lastIndex];
        let parentIndex;

        if(this.maxHeap()){
            //大顶堆
            while (lastIndex > 0) {
                parentIndex = Math.floor((lastIndex-1)/2);
                if(this.compare(last, data[parentIndex]) > 0) {
                    data[lastIndex] = data[parentIndex];
                    lastIndex = parentIndex;
                }else{
                    break;
                }
            }
            data[lastIndex] = last;
        }else{
            //小顶堆
            while (lastIndex > 0) {
                parentIndex = Math.floor((lastIndex-1)/2);
                if(this.compare(last, data[parentIndex]) < 0) {
                    data[lastIndex] = data[parentIndex];
                    lastIndex = parentIndex;
                }else{
                    break;
                }
            }
            data[lastIndex] = last;
        }

    }

    give(item) {
        this.data.push(item);
        this.heapingUp(this.data);
    }

    get length(){
        return this.data.length;
    }
}