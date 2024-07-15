class PriceQueue<T> {
    private queue: T[];
    private maxSize: number;
  
    constructor(maxSize: number) {
      this.queue = [];
      this.maxSize = maxSize;
    }
  
    enqueue(item: T): void {
      if (this.queue.length >= this.maxSize) {
        this.queue.shift();
      }
      this.queue.push(item);
    }
  
    getItems(): T[] {
      return this.queue;
    }
  
    getSize(): number {
      return this.queue.length;
    }

    toArray(): T[] {
        return [...this.queue].reverse();
    }
    
    clear(): void {
      this.queue = [];
    }
  }
  
  export default PriceQueue;
  