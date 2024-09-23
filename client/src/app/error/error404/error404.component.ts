import { Component, OnInit } from '@angular/core';

declare var $: any; // Declara jQuery para TypeScript

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(window).on('load', function() {
      'use strict';
      /*
      ----------------------------------------------------------------------
      Preloader
      ----------------------------------------------------------------------
      */
      $('.loader').delay(400).fadeOut();
      $('.animationload').delay(400).fadeOut('fast');
    });

    $(document).ready(function() {
      $('.sw_btn').on('click', function(){
        $('body').toggleClass('light');
      });

      /*
      ----------------------------------------------------------------------
      Nice scroll
      ----------------------------------------------------------------------
      */
      $('body').niceScroll({
        cursorcolor: '#fff',
        cursoropacitymin: '0',
        cursoropacitymax: '1',
        cursorwidth: '2px',
        zindex: 999999,
        horizrailenabled: false,
        enablekeyboard: false
      });
    });
  }
}
