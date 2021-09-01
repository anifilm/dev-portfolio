import { writable } from 'svelte/store';
import cryptoRandomString from 'crypto-random-string';
import _find from 'lodash/find';
import _remove from 'lodash/remove';
import _cloneDeep from 'lodash/cloneDeep';

// 10자의 고유(랜덤)한 문자열을 생성하는 함수
const crypto = () => {
  return cryptoRandomString({ length: 10 });
};
//console.log(crypto());

// 브라우저의 로컬 스토리지(저장소)에서 `lists` 이름으로 저장된 데이터를 가져옴
// 데이터가 없다면 빈 배열을 할당
const repoLists = JSON.parse(window.localStorage.getItem('lists')) || [];

// 이 자바스크립트 파일 내부에서 사용하는 쓰기 가능한 스토어 생성
const _lists = writable(repoLists);
// 스토어를 구독해서 값이 바뀌면,
// 브라우저의 로컬 스토리지에 `lists` 이름으로 데이터를 저장(갱신)
_lists.subscribe(($lists) => {
  window.localStorage.setItem('lists', JSON.stringify($lists));
});

// 커스텀 스토어 lists를 생성
// 스토어의 `set`, `update` 메서드는 선택사항
export const lists = {
  // 스토어 자동 구독을 위해 subscribe를 필수 포함(커스텀 스토어)
  subscribe: _lists.subscribe,
  reorder(payload) {
    const { oldIndex, newIndex } = payload;
    _lists.update(($lists) => {
      const clone = _cloneDeep($lists[oldIndex]);
      $lists.splice(oldIndex, 1);
      $lists.splice(newIndex, 0, clone);
      return $lists;
    });
  },
  add(payload) {
    const { title } = payload;
    _lists.update(($lists) => {
      $lists.push({
        id: crypto(),
        title: title,
        cards: []
      });
      return $lists;
    });
  },
  edit(payload) {
    const { listId, title } = payload;
    _lists.update(($lists) => {
      //const foundList = $lists.find((list) => {
      //  return list.id === listId;
      //});
      const foundList = _find($lists, { id: listId });
      foundList.title = title;
      return $lists;
    });
  },
  remove(payload) {
    const { listId } = payload;
    _lists.update(($lists) => {
      _remove($lists, { id: listId });
      return $lists;
    });
  }
};

// 커스텀 스토어와 비슷한 cards 객체를 생성
// (subscribe 메서드가 없기 때문에 커스텀 스토어라고 부를 수 없다.)
// 외부에서 사용하는 여러 메서드가 포함된 객체이다.
export const cards = {
  reorder(payload) {
    const { fromListId, toListId, oldIndex, newIndex } = payload;
    _lists.update(($lists) => {
      const fromList = _find($lists, { id: fromListId });
      const toList = (fromListId === toListId) ? fromList : _find($lists, { id: toListId });
      const clone = _cloneDeep(fromList.cards[oldIndex]);
      fromList.cards.splice(oldIndex, 1);
      toList.cards.splice(newIndex, 0, clone);
      return $lists;
    });
  },
  add(payload) {
    const { listId, title } = payload;
    _lists.update(($lists) => {
      const foundList = _find($lists, { id: listId });
      foundList.cards.push({
        id: crypto(),
        title: title,
      });
      return $lists;
    });
  },
  edit(payload) {
    const { listId, cardId, title } = payload;
    _lists.update(($lists) => {
      const foundList = _find($lists, { id: listId });
      const foundCard = _find(foundList.cards, { id: cardId });
      foundCard.title = title;
      return $lists;
    });
  },
  remove(payload) {
    const { listId, cardId } = payload;
    _lists.update(($lists) => {
      const foundList = _find($lists, { id: listId });
      _remove(foundList.cards, { id: cardId });
      return $lists;
    });
  }
};
