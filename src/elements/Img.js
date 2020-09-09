'use strict';

import { CanvasObject } from '../core/CanvasObject';

export class Img extends CanvasObject {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx 2D コンテキスト
   * @param {number} x X 座標
   * @param {number} y Y 座標
   * @param {number | null} w width nullの場合オリジナル
   * @param {number | null} h height nullの場合オリジナル
   * @param {string} imagePath 画像パス
   */
  constructor(ctx, x, y, w = null, h = null, imagePath) {
    super(ctx, x, y, w, h);
    /**
     * 角度
     * @type {number}
     */
    this.angle = 0;

    this.image = new Image();
    this.image.src = imagePath;
    this.image.onload = () => {
      this.isLoaded = true;
      this.width = w ? w : this.image.width;
      this.height = h ? h : this.image.height;
    };

    this.scaleInfo = {
      value: 1.0,
      amount: 0.01,
      max: 2,
      min: 0.5,
    };

    this.dragInfo = {
      isDragging: false,
      startX: 0,
      startY: 0,
      diffX: 0,
      diffY: 0,
    };

    /**
     * 読み込み済みフラグ
     * @type {boolean}
     */
    this.isLoaded = false;
  }

  /**
   * 描画更新
   * @param {number} x X 座標
   * @param {number} y Y 座標
   */
  update(x, y) {
    if (!this.isLoaded) return;

    const _x = x || this.position.x;
    const _y = y || this.position.y;

    this.position.set(_x, _y);
    this.draw();
  }

  /**
   * 画像を描画する
   */
  draw() {
    // スケールを反映した値で計算
    let offsetX = (this.width * this.scaleInfo.value) / 2;
    let offsetY = (this.height * this.scaleInfo.value) / 2;

    this.ctx.save();
    // Angle
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate((this.angle * Math.PI) / 180);
    this.ctx.drawImage(
      this.image,
      -offsetX,
      -offsetY,
      this.width * this.scaleInfo.value,
      this.height * this.scaleInfo.value
    );
    this.ctx.restore();
  }

  /**
   * 角度を変更して描画
   * @param {Number} angle
   */
  changeAngle(angle) {
    this.angle = this.angle + angle;
    this.update();
  }

  /**
   * scale up
   */
  scaleUp() {
    const _result = this.scaleInfo.value + this.scaleInfo.amount;
    const _value = Math.round(_result * 100) / 100;

    if (_value >= this.scaleInfo.max) return;
    this.scaleInfo.value = _value;
    this.update();
  }

  /**
   * scale down
   */
  scaleDown() {
    const _result = this.scaleInfo.value - this.scaleInfo.amount;
    const _value = Math.round(_result * 100) / 100;

    if (_value <= this.scaleInfo.min) return;

    this.scaleInfo.value = Math.round(_value * 100) / 100;
    this.update();
  }

  /**
   * ドラッグ開始
   * @param {Number} pageX
   * @param {Number} pageY
   */
  dragStart(pageX, pageY) {
    this.dragInfo.isDragging = true;
    this.dragInfo.startX = this.position.x - pageX;
    this.dragInfo.startY = this.position.y - pageY;
  }

  /**
   * ドラッグ
   * @param {Object} event
   */
  drag(pageX, pageY) {
    if (!this.dragInfo.isDragging) return;

    this.update(this.dragInfo.startX + pageX, this.dragInfo.startY + pageY);
  }

  /**
   * ドラッグ終了
   */
  dragEnd() {
    if (!this.dragInfo.isDragging) return;
    this.dragInfo.isDragging = false;
  }
}