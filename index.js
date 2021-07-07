var canvas, canvasImage;
var rects, Count_rect;
var color, context;
var Drag_Draw, Drag_Move;
var dragX, dragY;
var dragIndexDelete, dragIndexMove;
var Start_drag_Location;
var background_color;
var tempX, tempY;
var mouseX, mouseY;
var dx, dy;
var targetX, targetY;
var random_flag = false;

window.addEventListener('load', init, false);
window.onload = window.onresize = function()
	{
		var canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth * 0.6;
		canvas.height = window.innerHeight * 0.7;
		draw_rects();
	}

//initialize global variables
function init()
	{
		canvas = document.getElementById("canvas");
		context = canvas.getContext('2d');
		context.lineWidth = 4;
		context.lineCap = 'round';

		Count_rect=0;
		Drag_Draw = false;
		background_color = "#000000";
		rects = [];

		canvas.addEventListener('mousedown', check_draw_move, false);

		canvas.addEventListener('dblclick', rects_delete,false);
	}

function check_draw_move(event)
	{
		var i;
		var bRect = canvas.getBoundingClientRect();

		mouseX = (event.clientX - bRect.left) * (canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top) *(canvas.height/bRect.height);
		if (Count_rect == 0)
			{
				window.removeEventListener('mousedown', mouseDown, false);
				window.addEventListener('mousedown', dragStart, false);
				window.addEventListener('mousemove', drag, false);
				window.addEventListener('mouseup', dragStop, false);
				return false;
			}
		else
			{
				for (i=0; i < Count_rect; i++)
					{
						if	(check_rect_clicked(rects[i], mouseX, mouseY))
							{
								window.removeEventListener('mousedown', dragStart, false);
								window.removeEventListener('mousemove', drag, false);
								window.removeEventListener('mouseup', dragStop, false);
								window.addEventListener('mousedown', mouseDown, false);
								return false;
							}
					}
				}
				window.removeEventListener('mousedown', mouseDown, false);
				window.addEventListener('mousedown', dragStart, false);
				window.addEventListener('mousemove', drag, false);
				window.addEventListener('mouseup', dragStop, false);
				return  false;
		}
function dragStart(event)
	{
		Drag_Draw = true;
		Start_drag_Location = getCanvasCoordinates(event);
		color = "rgb(" + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) +")";
		getImage();
	}

function drag(event)
	{
		var position;
		if (Drag_Draw === true)
			{
				putImage();
				position = getCanvasCoordinates(event);
				draw_rectangle(position);
				context.fillStyle = color;
				context.fill();
			}
		}
function dragStop(event)
	{
		Drag_Draw = false;
		putImage();
		var position = getCanvasCoordinates(event);
		draw_rectangle(position);
		context.fillStyle = color;
		context.fill();
		Count_rect=Count_rect+1;
		temp_rect = {x:tempX, y:tempY, wid:Math.abs(width), hei:Math.abs(height),color:color};

		rects.push(temp_rect);

	}

function getCanvasCoordinates(event)
	{

		var x = event.clientX - canvas.getBoundingClientRect().left
		var y = event.clientY - canvas.getBoundingClientRect().top;

		return {x: x, y: y};
	}

function getImage()
	{
		canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
	}

function putImage()
	{
		context.putImageData(canvasImage, 0, 0);
	}

function draw_rectangle(position)
	{

		tempX=Start_drag_Location.x;
		tempY=Start_drag_Location.y;

		width = tempX - position.x
		height = tempY - position.y

		context.beginPath();
		context.rect(position.x, position.y, width, height);
		context.closePath();
	}

function drawScreen()
	{
		Count_rect=0;
		rects = [];
		context.fillStyle = background_color;
		context.fillRect(0,0,canvas.width,canvas.height);
	}


function draw_rects()
	{
		var i;
		var x;
		var y;
		var color;

		context.fillStyle = background_color;
		context.fillRect(0,0,canvas.width,canvas.height);

		for (i=0; i < Count_rect; i++)
			{
					wid = rects[i].wid;
					hei = rects[i].hei;

					x = rects[i].x;
					y = rects[i].y;

					color=rects[i].color;
					context.beginPath();
					context.rect(x, y, wid, hei);
					context.closePath();
					context.fillStyle = color;
					context.fill();
			}
	}

function check_rect_clicked(shape,mx,my)
	{
		return( mx > shape.x && mx < shape.x + shape.wid
			&&   my > shape.y && my < shape.y + shape.hei);
	}

function rects_delete(event)
	{
		var i;
		var bRect = canvas.getBoundingClientRect();
		dragIndexDelete=-1;

		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);

		for (i=0; i < Count_rect; i++)
			{
				if	(check_rect_clicked(rects[i], mouseX, mouseY))
					{
						dragIndexDelete = i;
					}
			}

		if ( dragIndexDelete> -1 )
			{
				rects.splice(dragIndexDelete,1)[0];
				Count_rect=Count_rect-1;
			}

		if (event.preventDefault)
			{
				event.preventDefault();
			}
		else if (event.returnValue)
			{
				event.returnValue = false;
			}
		draw_rects();
		return false;
	}

function mouseDown(event)
	{

		var i;
		var highestIndex = -1;
		var bRect = canvas.getBoundingClientRect();

		mouseX = (event.clientX - bRect.left) * (canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top) *(canvas.height/bRect.height);

		for (i=0; i < Count_rect; i++)
			{
				if	(check_rect_clicked(rects[i], mouseX, mouseY))
					{
						Drag_Move = true;

						if (i > highestIndex)
							{
								dragX = mouseX - rects[i].x;
								dragY = mouseY - rects[i].y;
								highestIndex = i;
								dragIndexMove = i;
							}
					}
			}
		if (Drag_Move)
			{
				window.addEventListener("mousemove", mouseMove, false);
				rects.push(rects.splice(dragIndexMove,1)[0]);
			}
		canvas.removeEventListener("mousedown", mouseDown, false);
		window.addEventListener("mouseup", mouseUp, false);

		if (event.preventDefault)
			{
				event.preventDefault();
			}
		else if (event.returnValue)
			{
				event.returnValue = false;
			}
		return false;
	}

function mouseUp(event)
	{

		canvas.addEventListener("mousedown", mouseDown, false);
		window.removeEventListener("mouseup", mouseUp, false);
		if (Drag_Move)
			{
				Drag_Move = false;
				window.removeEventListener("mousemove", mouseMove, false);
			}
	}

function mouseMove(event)
	{

		var posX;
		var posY;
		var shapeX = rects[Count_rect-1].wid;
		var shapeY = rects[Count_rect-1].hei;

		var minX = shapeX / 2000;
		var maxX = canvas.width - shapeX;
		var minY = shapeY / 2000;
		var maxY = canvas.height - shapeY;

		var bRect = canvas.getBoundingClientRect();
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);

		posX = mouseX - dragX;
		posY = mouseY - dragY;

		if (posX < minX)
		{
			posX = minX
		}
		else if (posX > maxX)
		{
			posX = maxX
		}

		if (posY < minY)
		{
			posY = minY
		}
		else if (posY > maxY)
		{
			posY = maxY
		}

		rects[Count_rect-1].x = posX;
		rects[Count_rect-1].y = posY;

		draw_rects();

	}
