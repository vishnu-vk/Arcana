



$(function() {
    /*animation for menu  start*/
    $('.open-menu').click(function(){
         $("#app-nav").css("display","block");
         $(".close .icon").css("visibility","visible");
         $(".close .icon").css("opacity","1");
         $(".open .icon").css("visibility","hidden");
         $(".open .icon").css("opacity","0");
         $(".close .label span").css("display","initial");
         $(".open .label span").css("display","none");
        return new TimelineMax( {
            tweens: [new TimelineMax( {
                tweens: [TweenMax.from($('#app-nav #nav-bg1'), 1, {
                    y: window.innerHeight, force3D: true, ease: Cubic.easeInOut
                }
                ), TweenMax.from($('#app-nav #nav-bg2'), 1, {
                    y: window.innerHeight, force3D: true, ease: Cubic.easeInOut
                }
                )], stagger: .1
            }
            ), new TimelineMax( {
                tweens: [new TimelineMax( {
                    tweens: [TweenMax.from($('#app-nav #nav-wrap .table .table-cell ul .bot'), 1, {
                        scaleY: 0, ease: Cubic.easeOut
                    }
                    ), TweenMax.from($('#app-nav #nav-wrap .table .table-cell ul .top'), 1, {
                        scaleY: 0, ease: Cubic.easeOut
                    }
                    )], stagger: .4
                }
                ), new TimelineMax( {
                    tweens: [TweenMax.allFromTo(document.querySelectorAll('#app-nav #nav-wrap .row span.red'), 1, {
                        x: '-100%'
                    }
                    , {
                        bezier: {
                            curviness: 0, values: [ {
                                x: '0%'
                            }
                            , {
                                x: '100%'
                            }
                            ]
                        }
                        , ease: Cubic.easeOut
                    }
                    , .1), TweenMax.allFromTo(document.querySelectorAll('#app-nav #nav-wrap .row span.dark'), 1, {
                        x: '-100%'
                    }
                    , {
                        bezier: {
                            curviness: 0, values: [ {
                                x: '0%'
                            }
                            , {
                                x: '100%'
                            }
                            ]
                        }
                        , ease: Cubic.easeOut
                    }
                    , .1)], stagger: .2
                }
                ), TweenMax.allFrom(document.querySelectorAll('#app-nav #nav-wrap ul li a .font-reg'), 1, {
                    x: '100%', force3D: true, ease: Cubic.easeOut
                }
                , .1), 
                new TimelineMax( {
                    tweens: [TweenMax.allFrom(document.querySelectorAll('#app-nav #nav-wrap .social li'), .9, {
                        y: '100%', force3D: true, ease: Cubic.easeInOut
                    }
                    , .09), TweenMax.from(document.querySelectorAll('#app-nav #nav-wrap .lang >span'), .9, {
                        y: '100%', force3D: true, ease: Cubic.easeInOut
                    }
                    ), TweenMax.from(document.querySelectorAll('#app-nav #nav-wrap .footer >span'), .9, {
                        y: '100%', force3D: true, ease: Cubic.easeInOut
                    }
                    )]
                }
                )], stagger: .2
            }
            )], stagger: .35, 
        }
        
        );
    });

    $('.close-menu').click(function(){
      
       
        $(".close .icon").css("visibility","hidden");
        $(".close .icon").css("opacity","0");
        $(".close .label span").css({"display":"none","transition":"2s"});
        $(".open .icon").css("visibility","visible");
        $(".open .icon").css("opacity","1");
        $(".open .label span").css({"display":"initial","transition":"2s"});
        $("#app-nav").css("display","none");
        
    });
    /*animation for menu  ends*/

    /*animation for menu open lines start*/
    $(".open .icon").mouseenter(function(){
        return new TimelineMax( {
            tweens: [new TimelineMax( {
                tweens: [new TimelineMax( {
                    tweens: [TweenMax.to($(".open .icon .line-top .line-1"), .6, {
                        bezier: {
                            values: [ {
                                height: 32, y: 0
                            }
                            , {
                                height: 0, y: -37
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    ), TweenMax.to($(".open .icon .line-top .line-2"), .6, {
                        bezier: {
                            values: [ {
                                height: 0, y: 12
                            }
                            , {
                                height: 12, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    )], stagger: .06
                }
                ), new TimelineMax( {
                    tweens: [TweenMax.to($(".open .icon .line-bot .line-1"), .6, {
                        bezier: {
                            values: [ {
                                height: 32, y: 0
                            }
                            , {
                                height: 0, y: -37
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    ), TweenMax.to($(".open .icon .line-bot .line-2"), .6, {
                        bezier: {
                            values: [ {
                                height: 0, y: 12
                            }
                            , {
                                height: 32, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    )], stagger: .06
                }
                )], stagger: .09
            }
            )
        

        
        ] });
        
    });

    $(".open .icon").mouseleave(function(){
        return new TimelineMax( {
            tweens: [new TimelineMax( {
                tweens: [new TimelineMax( {
                    tweens: [TweenMax.to($(".open .icon .line-top .line-2"), .6, {
                        bezier: {
                            values: [ {
                                height: 0, y: 12
                            }
                            , {
                                height: 0, y: 12
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    ), TweenMax.to($(".open .icon .line-top .line-1"), .6, {
                        bezier: {
                            values: [ {
                                height: 32, y: 0
                            }
                            , {
                                height: 12, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    )], stagger: .06
                }
                ), new TimelineMax( {
                    tweens: [TweenMax.to($(".open .icon .line-bot .line-2"), .6, {
                        bezier: {
                            values: [ {
                                height: 0, y: 12
                            }
                            , {
                                height: 0, y: 12
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    ), TweenMax.to($(".open .icon .line-bot .line-1"), .6, {
                        bezier: {
                            values: [ {
                                height: 32, y: 0
                            }
                            , {
                                height: 32, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    )], stagger: .06
                }
                )], stagger: .09
            }
            )]
        }
        
        );
    });
    /*animation for menu open lines ends*/



    /*animation for menu close lines start*/
    $('.close .icon').mouseenter(function(){
        return new TimelineMax( {
            tweens: [new TimelineMax( {
                tweens: [new TimelineMax( {
                    tweens: [TweenMax.to($(".close .icon .line-top .line-1"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: -25
                            }
                            , {
                                scaleY: 0, y: -25
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    ), TweenMax.to($(".close .icon .line-top .line-2"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: 25
                            }
                            , {
                                scaleY: 1, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    )], stagger: .05
                }
                ), new TimelineMax( {
                    tweens: [TweenMax.to($(".close .icon .line-bot .line-1"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: -25
                            }
                            , {
                                scaleY: 0, y: -25
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    ), TweenMax.to($(".close .icon .line-bot .line-2"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: 25
                            }
                            , {
                                scaleY: 1, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeOut
                    }
                    )], stagger: .05
                }
                )], stagger: .05
            }
            )]
        }
        
        );
    });

    $('.close .icon').mouseleave(function(){
        return new TimelineMax( {
            tweens: [new TimelineMax( {
                tweens: [new TimelineMax( {
                    tweens: [TweenMax.to($(".close .icon .line-top .line-1"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: -25
                            }
                            , {
                                scaleY: 1, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    ), TweenMax.to($(".close .icon .line-top .line-2"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: 25
                            }
                            , {
                                scaleY: 0, y: 25
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    )], stagger: .05
                }
                ), new TimelineMax( {
                    tweens: [TweenMax.to($(".close .icon .line-bot .line-1"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: -25
                            }
                            , {
                                scaleY: 1, y: 0
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    ), TweenMax.to($(".close .icon .line-bot .line-2"), .5, {
                        bezier: {
                            values: [ {
                                scaleY: 1.25, y: 25
                            }
                            , {
                                scaleY: 0, y: 25
                            }
                            ], curviness: 0
                        }
                        , force3D: true, ease: Cubic.easeInOut
                    }
                    )], stagger: .05
                }
                )], stagger: .05
            }
            )]
        }
        
        );
    });
    /*animation for menu close lines ends*/

    });