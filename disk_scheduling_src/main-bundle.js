(()=>{"use strict";var e={268:function(e,t,s){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=n(s(617));t.default=class{constructor(){this.display=new i.default}init(){document.getElementById("run_button").addEventListener("click",(()=>{this.run()})),document.getElementById("run_with_animation_button").addEventListener("click",(()=>{this.run(!0)})),document.getElementById("add_button").addEventListener("click",(()=>{this.addProcesses()})),document.getElementById("clear_button").addEventListener("click",(()=>{this.clearProcesses()})),this.display.init("main_canvas"),this.display.setResizeCallback((()=>{this.refreshProcesses()})),document.getElementById("results_close").addEventListener("click",(()=>{document.getElementById("results_wrapper").style.display="none"}))}addProcesses(){}clearProcesses(){}refreshProcesses(){}run(e=!1){}}},965:function(e,t,s){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=n(s(268));"undefined"!=typeof document&&((new i.default).init(),alert("Workin in progress! Currently not working. "))},617:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=class{constructor(){this.resizeCallback=null}init(e){const t=document.getElementById(e);this.ctx=t.getContext("2d"),window.addEventListener("resize",this.resizeToFit.bind(this)),this.resizeToFit()}resizeToFit(){this.ctx.canvas.width=window.innerWidth,this.ctx.canvas.height=window.innerHeight,null!=this.resizeCallback&&this.resizeCallback()}setResizeCallback(e){this.resizeCallback=e}}}},t={};!function s(n){var i=t[n];if(void 0!==i)return i.exports;var r=t[n]={exports:{}};return e[n].call(r.exports,r,r.exports,s),r.exports}(965)})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1idW5kbGUuanMiLCJtYXBwaW5ncyI6Im1MQUFBLGtCQUVBLGdCQUdJQSxjQUNJQyxLQUFLQyxRQUFVLElBQUksU0FDdkIsQ0FFQUMsT0FDdUJDLFNBQVNDLGVBQWUsY0FDaENDLGlCQUFpQixTQUFTLEtBQVFMLEtBQUtNLEtBQUssSUFFckJILFNBQVNDLGVBQWUsNkJBQ2hDQyxpQkFBaUIsU0FBUyxLQUFRTCxLQUFLTSxLQUFJLEVBQUssSUFFdkRILFNBQVNDLGVBQWUsY0FDaENDLGlCQUFpQixTQUFTLEtBQVFMLEtBQUtPLGNBQWMsSUFFM0NKLFNBQVNDLGVBQWUsZ0JBQ2hDQyxpQkFBaUIsU0FBUyxLQUFRTCxLQUFLUSxnQkFBZ0IsSUFFcEVSLEtBQUtDLFFBQVFDLEtBQUssZUFDbEJGLEtBQUtDLFFBQVFRLG1CQUFrQixLQUFRVCxLQUFLVSxrQkFBa0IsSUFJeENQLFNBQVNDLGVBQWUsaUJBQ2hDQyxpQkFBaUIsU0FBUyxLQUNwQ0YsU0FBU0MsZUFBZSxtQkFBbUJPLE1BQU1WLFFBQVUsTUFBTSxHQUV6RSxDQUVBTSxlQUNBLENBRUFDLGlCQUNBLENBRUFFLG1CQUNBLENBRUFKLElBQUlNLEdBQUksR0FFUixFLDJKQzVDSixrQkFHNEIsb0JBQWJULFlBQ00sSUFBSSxXQUNaRCxPQUVMVyxNQUFNLCtDLCtEQ1BkLGdCQUlJZCxjQUNJQyxLQUFLYyxlQUFpQixJQUMxQixDQUVBWixLQUFLYSxHQUNELE1BQU1DLEVBQTZCYixTQUFTQyxlQUFlVyxHQUMzRGYsS0FBS2lCLElBQU1ELEVBQU9FLFdBQVcsTUFFN0JDLE9BQU9kLGlCQUFpQixTQUFVTCxLQUFLb0IsWUFBWUMsS0FBS3JCLE9BRXhEQSxLQUFLb0IsYUFDVCxDQUVBQSxjQUNJcEIsS0FBS2lCLElBQUlELE9BQU9NLE1BQVFILE9BQU9JLFdBQy9CdkIsS0FBS2lCLElBQUlELE9BQU9RLE9BQVNMLE9BQU9NLFlBRUwsTUFBdkJ6QixLQUFLYyxnQkFDTGQsS0FBS2MsZ0JBRWIsQ0FFQUwsa0JBQWtCaUIsR0FDZDFCLEtBQUtjLGVBQWlCWSxDQUMxQixFLEdDM0JBQyxFQUEyQixDQUFDLEdBR2hDLFNBQVNDLEVBQW9CQyxHQUU1QixJQUFJQyxFQUFlSCxFQUF5QkUsR0FDNUMsUUFBcUJFLElBQWpCRCxFQUNILE9BQU9BLEVBQWFFLFFBR3JCLElBQUlDLEVBQVNOLEVBQXlCRSxHQUFZLENBR2pERyxRQUFTLENBQUMsR0FPWCxPQUhBRSxFQUFvQkwsR0FBVU0sS0FBS0YsRUFBT0QsUUFBU0MsRUFBUUEsRUFBT0QsUUFBU0osR0FHcEVLLEVBQU9ELE9BQ2YsQ0NuQjBCSixDQUFvQixJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY2xhc3Nlcy9NZW51LnRzIiwid2VicGFjazovLy8uL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4uL3NoYXJlZC9jbGFzc2VzL0Rpc3BsYXkudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy93ZWJwYWNrL3N0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpc3BsYXkgZnJvbSBcIi4uLy4uL3NoYXJlZC9jbGFzc2VzL0Rpc3BsYXlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSB7XG4gICAgZGlzcGxheTogRGlzcGxheVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IG5ldyBEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcnVuX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuX2J1dHRvblwiKTtcbiAgICAgICAgcnVuX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyB0aGlzLnJ1bigpIH0pO1xuXG4gICAgICAgIGNvbnN0IHJ1bl93aXRoX2FuaW1hdGlvbl9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJ1bl93aXRoX2FuaW1hdGlvbl9idXR0b25cIik7XG4gICAgICAgIHJ1bl93aXRoX2FuaW1hdGlvbl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgdGhpcy5ydW4odHJ1ZSkgfSk7XG5cbiAgICAgICAgY29uc3QgYWRkX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkX2J1dHRvblwiKTtcbiAgICAgICAgYWRkX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyB0aGlzLmFkZFByb2Nlc3NlcygpIH0pO1xuXG4gICAgICAgIGNvbnN0IGNsZWFyX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXJfYnV0dG9uXCIpO1xuICAgICAgICBjbGVhcl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHsgdGhpcy5jbGVhclByb2Nlc3NlcygpIH0pO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbml0KFwibWFpbl9jYW52YXNcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZXRSZXNpemVDYWxsYmFjaygoKSA9PiB7IHRoaXMucmVmcmVzaFByb2Nlc3NlcygpIH0pO1xuXG4gICAgICAgIC8qIHJlc3VsdHMgYnV0dG9ucyAqL1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHNfY2xvc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlc3VsdHNfY2xvc2VcIik7XG4gICAgICAgIHJlc3VsdHNfY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0c193cmFwcGVyXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkUHJvY2Vzc2VzKCk6IHZvaWQge1xuICAgIH1cblxuICAgIGNsZWFyUHJvY2Vzc2VzKCk6IHZvaWQge1xuICAgIH1cblxuICAgIHJlZnJlc2hQcm9jZXNzZXMoKTogdm9pZCB7XG4gICAgfVxuXG4gICAgcnVuKHggPSBmYWxzZSk6IHZvaWQge1xuXG4gICAgfVxufSIsImltcG9ydCBNZW51IGZyb20gJy4vY2xhc3Nlcy9NZW51JztcblxuZnVuY3Rpb24gbWFpbigpe1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XG4gICAgICAgIG1lbnUuaW5pdCgpO1xuXG4gICAgICAgIGFsZXJ0KFwiV29ya2luIGluIHByb2dyZXNzISBDdXJyZW50bHkgbm90IHdvcmtpbmcuIFwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFxuICAgIH1cbn1cblxubWFpbigpO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGxheSB7XG4gICAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkRcbiAgICByZXNpemVDYWxsYmFjazogKCkgPT4gdm9pZFxuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5yZXNpemVDYWxsYmFjayA9IG51bGw7XG4gICAgfVxuICAgIFxuICAgIGluaXQoZWxlbV9pZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbV9pZCk7XG4gICAgICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5yZXNpemVUb0ZpdC5iaW5kKHRoaXMpKTtcblxuICAgICAgICB0aGlzLnJlc2l6ZVRvRml0KCk7XG4gICAgfVxuXG4gICAgcmVzaXplVG9GaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZUNhbGxiYWNrICE9IG51bGwpe1xuICAgICAgICAgICAgdGhpcy5yZXNpemVDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0UmVzaXplQ2FsbGJhY2soY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXNpemVDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDk2NSk7XG4iXSwibmFtZXMiOlsiY29uc3RydWN0b3IiLCJ0aGlzIiwiZGlzcGxheSIsImluaXQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJ1biIsImFkZFByb2Nlc3NlcyIsImNsZWFyUHJvY2Vzc2VzIiwic2V0UmVzaXplQ2FsbGJhY2siLCJyZWZyZXNoUHJvY2Vzc2VzIiwic3R5bGUiLCJ4IiwiYWxlcnQiLCJyZXNpemVDYWxsYmFjayIsImVsZW1faWQiLCJjYW52YXMiLCJjdHgiLCJnZXRDb250ZXh0Iiwid2luZG93IiwicmVzaXplVG9GaXQiLCJiaW5kIiwid2lkdGgiLCJpbm5lcldpZHRoIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJjYWxsYmFjayIsIl9fd2VicGFja19tb2R1bGVfY2FjaGVfXyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImNhY2hlZE1vZHVsZSIsInVuZGVmaW5lZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJfX3dlYnBhY2tfbW9kdWxlc19fIiwiY2FsbCJdLCJzb3VyY2VSb290IjoiIn0=