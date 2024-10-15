// src/utils/LinkedList.js
export class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0; // เพิ่มพร็อพเพอร์ตี้ length
    }

    // เพิ่ม Node ใหม่ที่ท้าย LinkedList
    append(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++; // เพิ่มค่า length ทุกครั้งที่เพิ่ม Node
    }

    // แปลง LinkedList เป็น Array สำหรับการ render ใน React
    toArray() {
        const items = [];
        let current = this.head;
        while (current) {
            items.push(current.data);
            current = current.next;
        }
        return items;
    }

    // เมธอดสำหรับตรวจสอบขนาดของ LinkedList
    size() {
        return this.length;
    }
}
